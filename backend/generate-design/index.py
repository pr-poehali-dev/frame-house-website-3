import json
import os
import base64
import time
import boto3
import requests
import psycopg2
from datetime import datetime

STYLES = {
    "english": "English garden style: lush green lawn, roses, flower beds, wooden gazebo, curved pathways, hedges, cottage style landscaping",
    "japanese": "Japanese zen garden style: raked gravel, moss, bamboo, stone lanterns, bonsai trees, koi pond, wooden bridge, minimalist peaceful",
    "minimalist": "Modern minimalist garden: concrete paving, geometric shapes, ornamental grasses, steel edges, clean lines, contemporary outdoor design",
    "russian": "Traditional Russian countryside garden: vegetable beds, apple trees, sunflowers, wooden fence, birch trees, dacha style",
    "provence": "Provence French garden style: lavender fields, white stones, terracotta pots, roses, arched pergola, rustic Mediterranean atmosphere",
}


def handler(event: dict, context) -> dict:
    """Генерация дизайна участка через ИИ (Replicate) после оплаты."""
    if event.get("httpMethod") == "OPTIONS":
        return {
            "statusCode": 200,
            "headers": {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "POST, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type",
            },
            "body": "",
        }

    try:
        body = json.loads(event.get("body") or "{}")
        session_id = body.get("session_id")
        style = body.get("style")
        image_b64 = body.get("image_b64")
        order_number = body.get("order_number")

        if not all([session_id, style, image_b64]):
            return _err("Не переданы обязательные параметры", 400)

        if style not in STYLES:
            return _err(f"Неизвестный стиль: {style}", 400)

        # Загружаем фото в S3
        image_data = base64.b64decode(image_b64)
        s3 = boto3.client(
            "s3",
            endpoint_url="https://bucket.poehali.dev",
            aws_access_key_id=os.environ["AWS_ACCESS_KEY_ID"],
            aws_secret_access_key=os.environ["AWS_SECRET_ACCESS_KEY"],
        )
        key_source = f"designs/source/{session_id}_{int(time.time())}.jpg"
        s3.put_object(Bucket="files", Key=key_source, Body=image_data, ContentType="image/jpeg")
        source_url = f"https://cdn.poehali.dev/projects/{os.environ['AWS_ACCESS_KEY_ID']}/files/{key_source}"

        # Запускаем генерацию через Replicate (img2img)
        replicate_token = os.environ.get("REPLICATE_API_TOKEN", "")
        prompt = f"Transform this garden/yard into {STYLES[style]}, photorealistic, high quality, 4k, professional landscape photography"

        headers_r = {
            "Authorization": f"Token {replicate_token}",
            "Content-Type": "application/json",
        }
        payload = {
            "version": "a9758cbfbd5f3c2094457d996681af52552901575769880f5b8b39ba3e4927e7",
            "input": {
                "prompt": prompt,
                "image": source_url,
                "strength": 0.75,
                "guidance_scale": 7.5,
                "num_inference_steps": 30,
            },
        }
        resp = requests.post(
            "https://api.replicate.com/v1/predictions",
            headers=headers_r,
            json=payload,
            timeout=10,
        )
        pred = resp.json()
        prediction_id = pred.get("id")

        if not prediction_id:
            return _err("Ошибка запуска генерации", 500)

        # Ждём результат (до 60 сек)
        result_url = None
        for _ in range(30):
            time.sleep(2)
            check = requests.get(
                f"https://api.replicate.com/v1/predictions/{prediction_id}",
                headers=headers_r,
                timeout=10,
            ).json()
            status = check.get("status")
            if status == "succeeded":
                output = check.get("output")
                result_url = output[0] if isinstance(output, list) else output
                break
            if status in ("failed", "canceled"):
                return _err("Генерация не удалась, попробуйте ещё раз", 500)

        if not result_url:
            return _err("Превышено время ожидания генерации", 504)

        # Скачиваем и сохраняем результат в S3
        result_img = requests.get(result_url, timeout=30).content
        key_result = f"designs/result/{session_id}_{style}_{int(time.time())}.jpg"
        s3.put_object(Bucket="files", Key=key_result, Body=result_img, ContentType="image/jpeg")
        cdn_result = f"https://cdn.poehali.dev/projects/{os.environ['AWS_ACCESS_KEY_ID']}/files/{key_result}"

        # Сохраняем в БД
        try:
            conn = psycopg2.connect(os.environ["DATABASE_URL"])
            cur = conn.cursor()
            cur.execute(
                """INSERT INTO design_generations (session_id, style, status, source_image_url, result_image_url, completed_at)
                   VALUES (%s, %s, 'completed', %s, %s, %s)""",
                (session_id, style, source_url, cdn_result, datetime.utcnow()),
            )
            conn.commit()
            cur.close()
            conn.close()
        except Exception:
            pass  # Не блокируем ответ если БД недоступна

        return {
            "statusCode": 200,
            "headers": {"Access-Control-Allow-Origin": "*"},
            "body": json.dumps({"result_url": cdn_result, "style": style}),
            "isBase64Encoded": False,
        }

    except Exception as e:
        return _err(str(e), 500)


def _err(msg: str, code: int) -> dict:
    return {
        "statusCode": code,
        "headers": {"Access-Control-Allow-Origin": "*"},
        "body": {"error": msg},
        "isBase64Encoded": False,
    }
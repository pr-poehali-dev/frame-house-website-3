import json
import os
import base64
import time
import boto3
import requests
from datetime import datetime

STYLES = {
    "english": "Английский сад: ухоженный газон, розы, цветочные клумбы, деревянная беседка, изогнутые дорожки, живая изгородь, загородный стиль",
    "japanese": "Японский дзен-сад: граблёный гравий, мох, бамбук, каменные фонари, бонсай, пруд с карпами, деревянный мостик, минимализм",
    "minimalist": "Современный минималистичный сад: бетонное мощение, геометрические формы, декоративные злаки, стальные бордюры, чистые линии",
    "russian": "Традиционный русский дачный участок: грядки с овощами, яблони, подсолнухи, деревянный забор, берёзы, дача",
    "provence": "Сад в стиле прованс: поля лаванды, белые камни, терракотовые горшки, розы, арочная пергола, средиземноморская атмосфера",
}


def handler(event: dict, context) -> dict:
    """Генерация дизайна участка через YandexART после оплаты."""
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

        if not all([session_id, style, image_b64]):
            return _err("Не переданы обязательные параметры", 400)

        if style not in STYLES:
            return _err(f"Неизвестный стиль: {style}", 400)

        api_key = os.environ.get("YANDEX_API_KEY", "")
        folder_id = os.environ.get("YANDEX_FOLDER_ID", "")

        if not api_key or not folder_id:
            return _err("Не настроены ключи YandexART", 500)

        style_label = STYLES[style]
        prompt = (
            f"Фотореалистичный дизайн садового участка в стиле: {style_label}. "
            "Профессиональнаяландшафтная фотография, высокое качество, дневной свет, детализированно."
        )

        headers_y = {
            "Authorization": f"Api-Key {api_key}",
            "Content-Type": "application/json",
        }

        # Запускаем асинхронную генерацию YandexART
        payload = {
            "modelUri": f"art://{folder_id}/yandex-art/latest",
            "generationOptions": {
                "seed": int(time.time()) % 10000,
                "aspectRatio": {"widthRatio": 16, "heightRatio": 9},
            },
            "messages": [
                {"weight": 1, "text": prompt},
                {"weight": 0.5, "image": {"data": image_b64}},
            ],
        }

        resp = requests.post(
            "https://llm.api.cloud.yandex.net/foundationModels/v1/imageGenerationAsync",
            headers=headers_y,
            json=payload,
            timeout=15,
        )

        if resp.status_code != 200:
            return _err(f"Ошибка запуска генерации: {resp.text}", 500)

        operation_id = resp.json().get("id")
        if not operation_id:
            return _err("Не получен ID операции", 500)

        # Ждём результат (до 90 сек)
        result_b64 = None
        for _ in range(45):
            time.sleep(2)
            check = requests.get(
                f"https://llm.api.cloud.yandex.net/operations/{operation_id}",
                headers=headers_y,
                timeout=10,
            ).json()

            if check.get("done"):
                result_b64 = check.get("response", {}).get("image")
                break
            if check.get("error"):
                return _err(f"Ошибка генерации: {check['error'].get('message', '')}", 500)

        if not result_b64:
            return _err("Превышено время ожидания генерации", 504)

        # Сохраняем результат в S3
        result_img = base64.b64decode(result_b64)
        s3 = boto3.client(
            "s3",
            endpoint_url="https://bucket.poehali.dev",
            aws_access_key_id=os.environ["AWS_ACCESS_KEY_ID"],
            aws_secret_access_key=os.environ["AWS_SECRET_ACCESS_KEY"],
        )
        key_result = f"designs/result/{session_id}_{style}_{int(time.time())}.jpg"
        s3.put_object(Bucket="files", Key=key_result, Body=result_img, ContentType="image/jpeg")
        cdn_result = f"https://cdn.poehali.dev/projects/{os.environ['AWS_ACCESS_KEY_ID']}/files/{key_result}"

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

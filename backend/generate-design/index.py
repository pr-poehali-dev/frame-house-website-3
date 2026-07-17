import json
import os
import base64
import boto3
import requests
import time

STYLES = {
    "english": "English garden style: neatly trimmed lawn, roses, flower beds, wooden pergola, curved pathways, hedges, countryside atmosphere",
    "japanese": "Japanese zen garden style: raked gravel, moss, bamboo, stone lanterns, bonsai trees, koi pond, wooden bridge, minimalism",
    "minimalist": "Modern minimalist garden style: concrete pavement, geometric shapes, ornamental grasses, steel edging, clean lines",
    "russian": "Traditional Russian countryside garden style: vegetable beds, apple trees, sunflowers, wooden fence, birch trees, dacha atmosphere",
    "provence": "Provence style garden: lavender fields, white stones, terracotta pots, roses, arched pergola, mediterranean atmosphere",
    "custom": None,
}


def handler(event: dict, context) -> dict:
    """Генерация дизайна участка на основе загруженного фото через OpenAI (img2img)."""
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
        custom_desc = body.get("custom_desc", "")

        if not all([session_id, style, image_b64]):
            return _err("Missing required parameters", 400)

        if style not in STYLES:
            return _err(f"Unknown style: {style}", 400)

        if style == "custom" and not custom_desc.strip():
            return _err("Please describe the desired design", 400)

        api_key = os.environ.get("OPENAI_API_KEY", "")

        if not api_key:
            return _err("OpenAI API key is not configured", 500)

        if style == "custom":
            style_label = custom_desc.strip()
        else:
            style_label = STYLES[style]

        prompt = (
            f"Redesign this garden/backyard photo in the following style: {style_label}. "
            "Keep the same camera angle, perspective, house and overall layout of the yard, "
            "but transform the plants, landscaping, paths and decor according to the style. "
            "Photorealistic, high quality, daylight, highly detailed."
        )

        image_bytes = base64.b64decode(image_b64)

        resp = requests.post(
            "https://api.proxyapi.ru/openai/v1/images/edits",
            headers={"Authorization": f"Bearer {api_key}"},
            files={"image": ("photo.jpg", image_bytes, "image/jpeg")},
            data={
                "model": "gpt-image-1",
                "prompt": prompt,
                "size": "1536x1024",
                "n": 1,
            },
            timeout=120,
        )

        if resp.status_code != 200:
            return _err(f"Generation request failed: {resp.text}", 500)

        result_data = resp.json().get("data", [])
        if not result_data or not result_data[0].get("b64_json"):
            return _err("No image returned from generation service", 500)

        result_b64 = result_data[0]["b64_json"]

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
        cdn_result = f"https://cdn.poehali.dev/projects/{os.environ['AWS_ACCESS_KEY_ID']}/bucket/{key_result}"

        return {
            "statusCode": 200,
            "headers": {"Access-Control-Allow-Origin": "*", "Content-Type": "application/json"},
            "body": json.dumps({"result_url": cdn_result, "style": style}, ensure_ascii=True),
            "isBase64Encoded": False,
        }

    except Exception as e:
        return _err(str(e), 500)


def _err(msg: str, code: int) -> dict:
    return {
        "statusCode": code,
        "headers": {"Access-Control-Allow-Origin": "*", "Content-Type": "application/json"},
        "body": json.dumps({"error": msg}, ensure_ascii=True),
        "isBase64Encoded": False,
    }
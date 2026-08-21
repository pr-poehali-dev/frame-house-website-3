import json
import os
import urllib.request
import urllib.error


def handler(event: dict, context) -> dict:
    """Приём заявок на консультацию с сайта и отправка их в Telegram."""
    method = event.get("httpMethod", "GET")

    cors_headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
    }

    if method == "OPTIONS":
        return {"statusCode": 200, "headers": cors_headers, "body": ""}

    if method != "POST":
        return {
            "statusCode": 405,
            "headers": cors_headers,
            "body": json.dumps({"error": "Метод не поддерживается"}),
        }

    try:
        body = json.loads(event.get("body") or "{}")
    except json.JSONDecodeError:
        return {
            "statusCode": 400,
            "headers": cors_headers,
            "body": json.dumps({"error": "Некорректный JSON"}),
        }

    name = (body.get("name") or "").strip()
    phone = (body.get("phone") or "").strip()
    comment = (body.get("comment") or "").strip()
    page = (body.get("page") or "").strip()

    if not name or not phone:
        return {
            "statusCode": 400,
            "headers": cors_headers,
            "body": json.dumps({"error": "Укажите имя и телефон"}),
        }

    bot_token = os.environ.get("TELEGRAM_BOT_TOKEN")
    chat_id = os.environ.get("TELEGRAM_CHAT_ID")

    if not bot_token or not chat_id:
        return {
            "statusCode": 500,
            "headers": cors_headers,
            "body": json.dumps({"error": "Телеграм-уведомления не настроены"}),
        }

    text_lines = [
        "🔔 Новая заявка на консультацию",
        f"👤 Имя: {name}",
        f"📞 Телефон: {phone}",
    ]
    if comment:
        text_lines.append(f"💬 Вопрос: {comment}")
    if page:
        text_lines.append(f"🔗 Страница: {page}")
    text = "\n".join(text_lines)

    telegram_url = f"https://api.telegram.org/bot{bot_token}/sendMessage"
    payload = json.dumps({"chat_id": chat_id, "text": text}).encode("utf-8")
    req = urllib.request.Request(
        telegram_url,
        data=payload,
        headers={"Content-Type": "application/json"},
        method="POST",
    )

    try:
        with urllib.request.urlopen(req, timeout=5) as resp:
            resp.read()
    except urllib.error.URLError:
        return {
            "statusCode": 502,
            "headers": cors_headers,
            "body": json.dumps({"error": "Не удалось отправить уведомление"}),
        }

    return {
        "statusCode": 200,
        "headers": {**cors_headers, "Content-Type": "application/json"},
        "body": json.dumps({"success": True}),
    }

import json
import os
import urllib.request
import urllib.error
import psycopg2


def handler(event: dict, context) -> dict:
    """Приём заявок на консультацию с сайта: сохранение в БД и уведомление в Telegram."""
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

    if len(name) > 255:
        name = name[:255]
    if len(phone) > 50:
        phone = phone[:50]
    if len(page) > 500:
        page = page[:500]

    dsn = os.environ["DATABASE_URL"]
    conn = psycopg2.connect(dsn)
    try:
        with conn.cursor() as cur:
            name_esc = name.replace("'", "''")
            phone_esc = phone.replace("'", "''")
            comment_esc = comment.replace("'", "''")
            page_esc = page.replace("'", "''")

            cur.execute(
                f"""
                INSERT INTO consultation_requests (name, phone, comment, page)
                VALUES ('{name_esc}', '{phone_esc}', '{comment_esc}', '{page_esc}')
                RETURNING id
                """
            )
            new_id = cur.fetchone()[0]
            conn.commit()
    finally:
        conn.close()

    bot_token = os.environ.get("TELEGRAM_BOT_TOKEN")
    chat_id = os.environ.get("TELEGRAM_CHAT_ID")

    if bot_token and chat_id:
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
            pass

    return {
        "statusCode": 200,
        "headers": {**cors_headers, "Content-Type": "application/json"},
        "body": json.dumps({"success": True, "id": new_id}),
    }

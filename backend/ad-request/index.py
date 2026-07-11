import json
import os
import re
import psycopg2


def handler(event: dict, context) -> dict:
    """Приём заявок от рекламодателей на размещение рекламы на сайте."""
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

    company_name = (body.get("company_name") or "").strip()
    contact_name = (body.get("contact_name") or "").strip()
    phone = (body.get("phone") or "").strip()
    email = (body.get("email") or "").strip()
    website = (body.get("website") or "").strip()
    comment = (body.get("comment") or "").strip()

    if not company_name or not contact_name or not phone or not email:
        return {
            "statusCode": 400,
            "headers": cors_headers,
            "body": json.dumps({"error": "Заполните название компании, имя, телефон и email"}),
        }

    email_pattern = r"^[^@\s]+@[^@\s]+\.[^@\s]+$"
    if not re.match(email_pattern, email):
        return {
            "statusCode": 400,
            "headers": cors_headers,
            "body": json.dumps({"error": "Некорректный email"}),
        }

    dsn = os.environ["DATABASE_URL"]
    conn = psycopg2.connect(dsn)
    try:
        with conn.cursor() as cur:
            company_esc = company_name.replace("'", "''")
            contact_esc = contact_name.replace("'", "''")
            phone_esc = phone.replace("'", "''")
            email_esc = email.replace("'", "''")
            website_esc = website.replace("'", "''")
            comment_esc = comment.replace("'", "''")

            cur.execute(
                f"""
                INSERT INTO ad_requests (company_name, contact_name, phone, email, website, comment)
                VALUES ('{company_esc}', '{contact_esc}', '{phone_esc}', '{email_esc}', '{website_esc}', '{comment_esc}')
                RETURNING id
                """
            )
            new_id = cur.fetchone()[0]
            conn.commit()
    finally:
        conn.close()

    return {
        "statusCode": 200,
        "headers": {**cors_headers, "Content-Type": "application/json"},
        "body": json.dumps({"success": True, "id": new_id}),
    }

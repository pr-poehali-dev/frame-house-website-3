import json
import os

import psycopg2


def handler(event: dict, context) -> dict:
    """Приём и получение отзывов посетителей сайта."""
    method = event.get("httpMethod", "GET")

    cors_headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
    }

    if method == "OPTIONS":
        return {"statusCode": 200, "headers": cors_headers, "body": ""}

    dsn = os.environ["DATABASE_URL"]
    conn = psycopg2.connect(dsn)
    try:
        if method == "GET":
            with conn.cursor() as cur:
                cur.execute(
                    "SELECT id, name, rating, text, created_at FROM reviews WHERE is_hidden = FALSE ORDER BY created_at DESC LIMIT 50"
                )
                rows = cur.fetchall()
            reviews = [
                {
                    "id": r[0],
                    "name": r[1],
                    "rating": r[2],
                    "text": r[3],
                    "created_at": r[4].isoformat(),
                }
                for r in rows
            ]
            return {
                "statusCode": 200,
                "headers": {**cors_headers, "Content-Type": "application/json"},
                "body": json.dumps({"reviews": reviews}),
            }

        if method == "POST":
            try:
                body = json.loads(event.get("body") or "{}")
            except json.JSONDecodeError:
                return {
                    "statusCode": 400,
                    "headers": cors_headers,
                    "body": json.dumps({"error": "Некорректный JSON"}),
                }

            name = (body.get("name") or "").strip()
            text = (body.get("text") or "").strip()
            rating = body.get("rating")

            if not name or not text or not isinstance(rating, int) or not (1 <= rating <= 5):
                return {
                    "statusCode": 400,
                    "headers": cors_headers,
                    "body": json.dumps({"error": "Укажите имя, текст отзыва и оценку от 1 до 5"}),
                }

            if len(name) > 100:
                name = name[:100]
            if len(text) > 2000:
                text = text[:2000]

            name_esc = name.replace("'", "''")
            text_esc = text.replace("'", "''")

            with conn.cursor() as cur:
                cur.execute(
                    f"""
                    INSERT INTO reviews (name, rating, text)
                    VALUES ('{name_esc}', {int(rating)}, '{text_esc}')
                    RETURNING id, created_at
                    """
                )
                new_id, created_at = cur.fetchone()
                conn.commit()

            return {
                "statusCode": 200,
                "headers": {**cors_headers, "Content-Type": "application/json"},
                "body": json.dumps({
                    "success": True,
                    "review": {
                        "id": new_id,
                        "name": name,
                        "rating": rating,
                        "text": text,
                        "created_at": created_at.isoformat(),
                    },
                }),
            }

        return {
            "statusCode": 405,
            "headers": cors_headers,
            "body": json.dumps({"error": "Метод не поддерживается"}),
        }
    finally:
        conn.close()
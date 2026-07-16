import json
import os
import hashlib
import random
import base64
import boto3
import psycopg2
from urllib.parse import urlencode, quote_plus
from datetime import datetime


def calculate_signature(*args) -> str:
    """MD5 подпись по документации Robokassa"""
    joined = ':'.join(str(arg) for arg in args)
    return hashlib.md5(joined.encode()).hexdigest()


def get_db_connection():
    dsn = os.environ.get('DATABASE_URL')
    schema = os.environ.get('MAIN_DB_SCHEMA', 'public')
    conn = psycopg2.connect(dsn, options=f'-c search_path="{schema}"')
    return conn


HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Session-Id',
    'Access-Control-Max-Age': '86400',
    'Content-Type': 'application/json'
}

ROBOKASSA_URL = 'https://auth.robokassa.ru/Merchant/Index.aspx'

# Настройки фискализации (54-ФЗ): УСН доходы, без НДС
TAX_SYSTEM = 'usn_income'
VAT_TYPE = 'none'


def build_receipt(name: str, amount: float) -> dict:
    """Формирование чека для фискализации Robokassa (54-ФЗ)"""
    return {
        'sno': TAX_SYSTEM,
        'items': [{
            'name': name[:128],
            'quantity': 1,
            'sum': round(amount, 2),
            'payment_method': 'full_payment',
            'payment_object': 'service',
            'tax': VAT_TYPE
        }]
    }


def handler(event: dict, context) -> dict:
    '''
    Каталог PDF-гайдов: список, создание заказа на оплату, проверка статуса и получение ссылки на скачивание.
    GET  без параметров -> список гайдов
    GET  ?order_number=XXX -> статус заказа и ссылки на скачивание (если оплачен)
    POST {action: "create_order", guide_slug, user_name, user_email, user_phone} -> payment_url
    '''
    method = event.get('httpMethod', 'GET').upper()

    if method == 'OPTIONS':
        return {'statusCode': 200, 'headers': HEADERS, 'body': '', 'isBase64Encoded': False}

    if method == 'GET':
        params = event.get('queryStringParameters') or {}
        order_number = params.get('order_number')

        conn = get_db_connection()
        cur = conn.cursor()

        if order_number:
            cur.execute("""
                SELECT o.status, g.slug, g.title, gd.download_token
                FROM orders o
                JOIN order_items oi ON oi.order_id = o.id
                JOIN guides g ON g.slug = oi.product_id
                LEFT JOIN guide_downloads gd ON gd.order_id = o.id AND gd.guide_id = g.id
                WHERE o.order_number = %s
            """, (order_number,))
            rows = cur.fetchall()
            cur.close()
            conn.close()

            if not rows:
                return {'statusCode': 404, 'headers': HEADERS, 'body': json.dumps({'error': 'Order not found'}), 'isBase64Encoded': False}

            status = rows[0][0]
            items = [{'slug': r[1], 'title': r[2], 'download_token': r[3]} for r in rows]

            return {
                'statusCode': 200,
                'headers': HEADERS,
                'body': json.dumps({'status': status, 'items': items}),
                'isBase64Encoded': False
            }

        download_token = params.get('token')
        if download_token:
            cur.execute("""
                SELECT g.pdf_url, g.title
                FROM guide_downloads gd
                JOIN guides g ON g.id = gd.guide_id
                WHERE gd.download_token = %s
            """, (download_token,))
            row = cur.fetchone()
            if not row:
                cur.close()
                conn.close()
                return {'statusCode': 404, 'headers': HEADERS, 'body': json.dumps({'error': 'Invalid token'}), 'isBase64Encoded': False}

            cur.execute("UPDATE guide_downloads SET downloads_count = downloads_count + 1 WHERE download_token = %s", (download_token,))
            conn.commit()
            cur.close()
            conn.close()
            return {
                'statusCode': 200,
                'headers': HEADERS,
                'body': json.dumps({'pdf_url': row[0], 'title': row[1]}),
                'isBase64Encoded': False
            }

        cur.execute("""
            SELECT slug, title, description, section, price, pages_count, emoji
            FROM guides ORDER BY section, id
        """)
        rows = cur.fetchall()
        cur.close()
        conn.close()

        guides = [{
            'slug': r[0], 'title': r[1], 'description': r[2], 'section': r[3],
            'price': float(r[4]), 'pages_count': r[5], 'emoji': r[6]
        } for r in rows]

        return {'statusCode': 200, 'headers': HEADERS, 'body': json.dumps({'guides': guides}), 'isBase64Encoded': False}

    if method != 'POST':
        return {'statusCode': 405, 'headers': HEADERS, 'body': json.dumps({'error': 'Method not allowed'}), 'isBase64Encoded': False}

    payload = json.loads(event.get('body', '{}'))

    if payload.get('action') == 'seed_guide':
        slug = payload['slug']
        pdf_b64 = payload['pdf_b64']

        s3 = boto3.client(
            's3',
            endpoint_url='https://bucket.poehali.dev',
            aws_access_key_id=os.environ['AWS_ACCESS_KEY_ID'],
            aws_secret_access_key=os.environ['AWS_SECRET_ACCESS_KEY'],
        )
        key = f'guides/{slug}.pdf'
        data = base64.b64decode(pdf_b64)
        s3.put_object(Bucket='files', Key=key, Body=data, ContentType='application/pdf')
        cdn_url = f"https://cdn.poehali.dev/projects/{os.environ['AWS_ACCESS_KEY_ID']}/bucket/{key}"

        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("""
            INSERT INTO guides (slug, title, description, section, price, pdf_url, pages_count, emoji)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            ON CONFLICT (slug) DO UPDATE SET
                title = EXCLUDED.title, description = EXCLUDED.description, section = EXCLUDED.section,
                price = EXCLUDED.price, pdf_url = EXCLUDED.pdf_url, pages_count = EXCLUDED.pages_count,
                emoji = EXCLUDED.emoji
        """, (
            slug, payload['title'], payload.get('description', ''), payload['section'],
            payload.get('price', 149), cdn_url, payload.get('pages_count', 0), payload.get('emoji', '📄'),
        ))
        conn.commit()
        cur.close()
        conn.close()

        return {'statusCode': 200, 'headers': HEADERS, 'body': json.dumps({'ok': True, 'pdf_url': cdn_url}), 'isBase64Encoded': False}

    try:
        merchant_login = os.environ.get('ROBOKASSA_MERCHANT_LOGIN')
        password_1 = os.environ.get('ROBOKASSA_PASSWORD_1')

        if not merchant_login or not password_1:
            return {'statusCode': 500, 'headers': HEADERS, 'body': json.dumps({'error': 'Robokassa credentials not configured'}), 'isBase64Encoded': False}

        guide_slug = str(payload.get('guide_slug', ''))
        if not guide_slug:
            cart_items = payload.get('cart_items') or []
            if cart_items:
                guide_slug = str(cart_items[0].get('id', ''))

        user_name = str(payload.get('user_name', ''))
        user_email = str(payload.get('user_email', ''))
        user_phone = str(payload.get('user_phone', ''))
        success_url = str(payload.get('success_url', ''))
        fail_url = str(payload.get('fail_url', ''))

        if not guide_slug or not user_name or not user_email:
            return {'statusCode': 400, 'headers': HEADERS, 'body': json.dumps({'error': 'guide_slug, user_name and user_email required'}), 'isBase64Encoded': False}

        conn = get_db_connection()
        cur = conn.cursor()

        cur.execute("SELECT id, title, price FROM guides WHERE slug = %s", (guide_slug,))
        guide = cur.fetchone()
        if not guide:
            cur.close()
            conn.close()
            return {'statusCode': 404, 'headers': HEADERS, 'body': json.dumps({'error': 'Guide not found'}), 'isBase64Encoded': False}

        guide_id, guide_title, amount = guide
        amount = float(amount)

        for _ in range(10):
            robokassa_inv_id = random.randint(100000, 2147483647)
            cur.execute("SELECT COUNT(*) FROM orders WHERE robokassa_inv_id = %s", (robokassa_inv_id,))
            if cur.fetchone()[0] == 0:
                break

        order_number = f"GDE-{datetime.now().strftime('%Y%m%d')}-{robokassa_inv_id}"

        cur.execute("""
            INSERT INTO orders (order_number, user_name, user_email, user_phone, amount, robokassa_inv_id, status, order_comment)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            RETURNING id
        """, (order_number, user_name, user_email, user_phone, round(amount, 2), robokassa_inv_id, 'pending', f'PDF-гайд: {guide_title}'))

        order_id = cur.fetchone()[0]

        cur.execute("""
            INSERT INTO order_items (order_id, product_id, product_name, product_price, quantity)
            VALUES (%s, %s, %s, %s, %s)
        """, (order_id, guide_slug, guide_title, amount, 1))

        amount_str = f"{amount:.2f}"

        # Чек для фискализации (54-ФЗ) — обязателен при включённой фискализации в кабинете Robokassa
        receipt = build_receipt(f'PDF-гайд: {guide_title}', amount)
        receipt_json = json.dumps(receipt, ensure_ascii=False, separators=(',', ':'))
        receipt_encoded = quote_plus(receipt_json)

        # Формула подписи (по документации Robokassa):
        # MerchantLogin:OutSum:InvId:Receipt(url-encoded)[:SuccessUrl2:SuccessUrl2Method:FailUrl2:FailUrl2Method]:Password#1
        signature_parts = [merchant_login, amount_str, robokassa_inv_id, receipt_encoded]
        if success_url and fail_url:
            signature_parts += [success_url, 'GET', fail_url, 'GET']
        signature_parts.append(password_1)
        signature = calculate_signature(*signature_parts)

        query_params = {
            'MerchantLogin': merchant_login,
            'OutSum': amount_str,
            'InvoiceID': robokassa_inv_id,
            'SignatureValue': signature,
            'Email': user_email,
            'Culture': 'ru',
            'Description': f'PDF-гайд: {guide_title}'
        }
        if success_url and fail_url:
            query_params['SuccessUrl2'] = success_url
            query_params['SuccessUrl2Method'] = 'GET'
            query_params['FailUrl2'] = fail_url
            query_params['FailUrl2Method'] = 'GET'

        # В GET-ссылке Receipt должен быть URL-кодирован дважды
        payment_url = f"{ROBOKASSA_URL}?{urlencode(query_params)}&Receipt={quote_plus(receipt_encoded)}"

        cur.execute("UPDATE orders SET payment_url = %s WHERE id = %s", (payment_url, order_id))
        conn.commit()
        cur.close()
        conn.close()

        return {
            'statusCode': 200,
            'headers': HEADERS,
            'body': json.dumps({'payment_url': payment_url, 'order_id': order_id, 'order_number': order_number}),
            'isBase64Encoded': False
        }
    except Exception as e:
        import traceback
        print(f"Guides error: {e}")
        print(traceback.format_exc())
        return {'statusCode': 500, 'headers': HEADERS, 'body': json.dumps({'error': str(e)}), 'isBase64Encoded': False}
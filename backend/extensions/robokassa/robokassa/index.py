import json
import os
import hashlib
import psycopg2
import random
from urllib.parse import urlencode, quote_plus
from datetime import datetime


def calculate_signature(*args) -> str:
    """Создание MD5 подписи по документации Robokassa"""
    joined = ':'.join(str(arg) for arg in args)
    return hashlib.md5(joined.encode()).hexdigest()


def get_db_connection():
    """Получение подключения к БД"""
    dsn = os.environ.get('DATABASE_URL')
    if not dsn:
        raise ValueError('DATABASE_URL not configured')
    schema = os.environ.get('MAIN_DB_SCHEMA', 'public')
    conn = psycopg2.connect(dsn, options=f'-c search_path="{schema}"')
    return conn


HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-User-Id, X-Session-Id, X-Auth-Token',
    'Access-Control-Max-Age': '86400',
    'Content-Type': 'application/json'
}

ROBOKASSA_URL = 'https://auth.robokassa.ru/Merchant/Index.aspx'

# Настройки фискализации (54-ФЗ): УСН доходы, без НДС
TAX_SYSTEM = 'usn_income'
VAT_TYPE = 'none'


def build_receipt(cart_items: list, amount: float, order_number: str) -> dict:
    """Формирование чека для фискализации Robokassa (54-ФЗ)"""
    items = []
    if cart_items:
        for item in cart_items:
            price = float(item.get('price', 0))
            quantity = float(item.get('quantity', 1)) or 1
            name = str(item.get('name', order_number))[:128]
            items.append({
                'name': name,
                'quantity': quantity,
                'sum': round(price * quantity, 2),
                'payment_method': 'full_payment',
                'payment_object': 'service',
                'tax': VAT_TYPE
            })
    else:
        items.append({
            'name': f'Заказ {order_number}'[:128],
            'quantity': 1,
            'sum': round(amount, 2),
            'payment_method': 'full_payment',
            'payment_object': 'service',
            'tax': VAT_TYPE
        })

    return {'sno': TAX_SYSTEM, 'items': items}


def handler(event: dict, context) -> dict:
    '''
    Создание заказа и генерация ссылки на оплату Robokassa, проверка статуса заказа.
    POST body: amount, user_name, user_email, user_phone, user_address, cart_items
    Returns: payment_url, order_id, order_number
    GET ?order_number=XXX -> {status: pending|paid}
    '''
    method = event.get('httpMethod', 'GET').upper()

    if method == 'OPTIONS':
        return {'statusCode': 200, 'headers': HEADERS, 'body': '', 'isBase64Encoded': False}

    if method == 'GET':
        params = event.get('queryStringParameters') or {}
        order_number = params.get('order_number')
        if not order_number:
            return {'statusCode': 400, 'headers': HEADERS, 'body': json.dumps({'error': 'order_number required'}), 'isBase64Encoded': False}

        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("SELECT status FROM orders WHERE order_number = %s", (order_number,))
        row = cur.fetchone()
        cur.close()
        conn.close()

        if not row:
            return {'statusCode': 404, 'headers': HEADERS, 'body': json.dumps({'error': 'Order not found'}), 'isBase64Encoded': False}

        return {'statusCode': 200, 'headers': HEADERS, 'body': json.dumps({'status': row[0]}), 'isBase64Encoded': False}

    if method != 'POST':
        return {'statusCode': 405, 'headers': HEADERS, 'body': json.dumps({'error': 'Method not allowed'}), 'isBase64Encoded': False}

    try:
        merchant_login = os.environ.get('ROBOKASSA_MERCHANT_LOGIN')
        password_1 = os.environ.get('ROBOKASSA_PASSWORD_1')

        if not merchant_login or not password_1:
            return {'statusCode': 500, 'headers': HEADERS, 'body': json.dumps({'error': 'Robokassa credentials not configured'}), 'isBase64Encoded': False}

        body_str = event.get('body', '{}')
        payload = json.loads(body_str)

        amount = float(payload.get('amount', 0))
        user_name = str(payload.get('user_name', ''))
        user_email = str(payload.get('user_email', ''))
        user_phone = str(payload.get('user_phone', ''))
        user_address = str(payload.get('user_address', ''))
        order_comment = str(payload.get('order_comment', ''))
        cart_items = payload.get('cart_items', [])
        success_url = str(payload.get('success_url', ''))
        fail_url = str(payload.get('fail_url', ''))

        if amount <= 0:
            return {'statusCode': 400, 'headers': HEADERS, 'body': json.dumps({'error': 'Amount must be greater than 0'}), 'isBase64Encoded': False}
        if not user_name or not user_email:
            return {'statusCode': 400, 'headers': HEADERS, 'body': json.dumps({'error': 'user_name and user_email required'}), 'isBase64Encoded': False}

        conn = get_db_connection()
        cur = conn.cursor()

        # Генерация уникального InvoiceID
        for _ in range(10):
            robokassa_inv_id = random.randint(100000, 2147483647)
            cur.execute("SELECT COUNT(*) FROM orders WHERE robokassa_inv_id = %s", (robokassa_inv_id,))
            if cur.fetchone()[0] == 0:
                break

        order_number = f"ORD-{datetime.now().strftime('%Y%m%d')}-{robokassa_inv_id}"

        cur.execute("""
            INSERT INTO orders (order_number, user_name, user_email, user_phone, amount, robokassa_inv_id, status, delivery_address, order_comment)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
            RETURNING id
        """, (order_number, user_name, user_email, user_phone, round(amount, 2), robokassa_inv_id, 'pending', user_address, order_comment))

        order_id = cur.fetchone()[0]

        for item in cart_items:
            cur.execute("""
                INSERT INTO order_items (order_id, product_id, product_name, product_price, quantity)
                VALUES (%s, %s, %s, %s, %s)
            """, (order_id, item.get('id'), item.get('name'), item.get('price'), item.get('quantity')))

        # Формирование ссылки на оплату
        amount_str = f"{amount:.2f}"

        # Чек для фискализации (54-ФЗ) — обязателен при включённой фискализации в кабинете Robokassa
        receipt = build_receipt(cart_items, amount, order_number)
        receipt_json = json.dumps(receipt, ensure_ascii=False, separators=(',', ':'))
        # Receipt участвует в подписи и в самом запросе в URL-кодированном виде (однократно)
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
            'Description': f'Заказ {order_number}'
        }

        if success_url and fail_url:
            query_params['SuccessUrl2'] = success_url
            query_params['SuccessUrl2Method'] = 'GET'
            query_params['FailUrl2'] = fail_url
            query_params['FailUrl2Method'] = 'GET'

        # В GET-ссылке Receipt должен быть URL-кодирован дважды:
        # urlencode() кодирует уже один раз закодированное значение receipt_encoded
        payment_url = f"{ROBOKASSA_URL}?{urlencode(query_params)}&Receipt={quote_plus(receipt_encoded)}"

        cur.execute("UPDATE orders SET payment_url = %s WHERE id = %s", (payment_url, order_id))
        conn.commit()
        cur.close()
        conn.close()

        return {
            'statusCode': 200,
            'headers': HEADERS,
            'body': json.dumps({
                'payment_url': payment_url,
                'order_id': order_id,
                'order_number': order_number
            }),
            'isBase64Encoded': False
        }
    except Exception as e:
        import traceback
        print(f"Robokassa error: {e}")
        print(traceback.format_exc())
        return {
            'statusCode': 500,
            'headers': HEADERS,
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }
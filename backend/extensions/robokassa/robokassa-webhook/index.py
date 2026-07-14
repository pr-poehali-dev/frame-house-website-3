import json
import os
import hashlib
import secrets
import smtplib
import psycopg2
from email.mime.text import MIMEText
from urllib.parse import parse_qs

SMTP_FROM_EMAIL = 'yunaliev.ismail@yandex.ru'
OWNER_EMAIL = 'yunaliev.ismail@yandex.ru'


def calculate_signature(*args) -> str:
    """Создание MD5 подписи по документации Robokassa"""
    joined = ':'.join(str(arg) for arg in args)
    return hashlib.md5(joined.encode()).hexdigest().upper()


def send_confirmation_email(to_email: str, order_number: str, amount: float, guide_items: list) -> None:
    """Отправка письма клиенту с подтверждением оплаты и ссылками на скачивание гайдов"""
    smtp_password = os.environ.get('SMTP_PASSWORD')
    if not smtp_password or not to_email:
        return

    lines = [f'Спасибо за заказ №{order_number}!', f'Сумма оплаты: {amount:.2f} ₽', '']

    if guide_items:
        lines.append('Ваши PDF-гайды готовы к скачиванию:')
        for title, pdf_url in guide_items:
            lines.append(f'— {title}: {pdf_url}')
        lines.append('')

    lines.append('Спасибо, что выбрали КаркасДом!')

    msg = MIMEText('\n'.join(lines), 'plain', 'utf-8')
    msg['Subject'] = f'Заказ №{order_number} оплачен'
    msg['From'] = SMTP_FROM_EMAIL
    msg['To'] = to_email

    try:
        with smtplib.SMTP_SSL('smtp.yandex.ru', 465) as server:
            server.login(SMTP_FROM_EMAIL, smtp_password)
            server.sendmail(SMTP_FROM_EMAIL, [to_email], msg.as_string())
    except Exception as e:
        print(f'Email send error: {e}')


def send_owner_notification(order_number: str, amount: float, user_name: str, user_email: str, user_phone: str, guide_items: list) -> None:
    """Уведомление владельцу магазина о новой оплате"""
    smtp_password = os.environ.get('SMTP_PASSWORD')
    if not smtp_password:
        return

    lines = [
        f'Новая оплата заказа №{order_number}',
        f'Сумма: {amount:.2f} ₽',
        f'Клиент: {user_name}',
        f'Email: {user_email}',
        f'Телефон: {user_phone}',
    ]

    if guide_items:
        lines.append('')
        lines.append('Товары:')
        for title, _ in guide_items:
            lines.append(f'— {title}')

    msg = MIMEText('\n'.join(lines), 'plain', 'utf-8')
    msg['Subject'] = f'Новая оплата: заказ №{order_number}'
    msg['From'] = SMTP_FROM_EMAIL
    msg['To'] = OWNER_EMAIL

    try:
        with smtplib.SMTP_SSL('smtp.yandex.ru', 465) as server:
            server.login(SMTP_FROM_EMAIL, smtp_password)
            server.sendmail(SMTP_FROM_EMAIL, [OWNER_EMAIL], msg.as_string())
    except Exception as e:
        print(f'Owner email send error: {e}')


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
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'text/plain'
}


def handler(event: dict, context) -> dict:
    '''
    Result URL вебхук от Robokassa для подтверждения оплаты.
    Robokassa отправляет: OutSum, InvId, SignatureValue
    Returns: OK{InvId} если подпись верна и заказ обновлён
    '''
    method = event.get('httpMethod', 'GET').upper()

    if method == 'OPTIONS':
        return {'statusCode': 200, 'headers': HEADERS, 'body': '', 'isBase64Encoded': False}

    password_2 = os.environ.get('ROBOKASSA_PASSWORD_2')
    if not password_2:
        return {'statusCode': 500, 'headers': HEADERS, 'body': 'Configuration error', 'isBase64Encoded': False}

    # Парсинг параметров из body или query string
    params = {}
    body = event.get('body', '')

    if method == 'POST' and body:
        if event.get('isBase64Encoded', False):
            import base64
            body = base64.b64decode(body).decode('utf-8')
        parsed = parse_qs(body)
        params = {k: v[0] for k, v in parsed.items()}

    if not params:
        params = event.get('queryStringParameters') or {}

    out_sum = params.get('OutSum', params.get('out_summ', ''))
    inv_id = params.get('InvId', params.get('inv_id', ''))
    signature_value = params.get('SignatureValue', params.get('crc', '')).upper()

    if not out_sum or not inv_id or not signature_value:
        return {'statusCode': 400, 'headers': HEADERS, 'body': 'Missing required parameters', 'isBase64Encoded': False}

    # Проверка подписи
    expected_signature = calculate_signature(out_sum, inv_id, password_2)
    if signature_value != expected_signature:
        return {'statusCode': 400, 'headers': HEADERS, 'body': 'Invalid signature', 'isBase64Encoded': False}

    # Обновление статуса заказа
    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute("""
        UPDATE orders
        SET status = 'paid', paid_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
        WHERE robokassa_inv_id = %s AND status = 'pending'
        RETURNING id, order_number, user_email, user_name, user_phone
    """, (int(inv_id),))

    result = cur.fetchone()

    if not result:
        # Проверяем, может уже оплачен
        cur.execute("SELECT status FROM orders WHERE robokassa_inv_id = %s", (int(inv_id),))
        existing = cur.fetchone()
        conn.close()

        if existing and existing[0] == 'paid':
            return {'statusCode': 200, 'headers': HEADERS, 'body': f'OK{inv_id}', 'isBase64Encoded': False}
        return {'statusCode': 404, 'headers': HEADERS, 'body': 'Order not found', 'isBase64Encoded': False}

    order_id, order_number, user_email, user_name, user_phone = result

    # Если в заказе есть PDF-гайды — создаём токены скачивания
    cur.execute("""
        SELECT g.id, g.title, g.pdf_url
        FROM order_items oi
        JOIN guides g ON g.slug = oi.product_id
        WHERE oi.order_id = %s
    """, (order_id,))
    guide_rows = cur.fetchall()

    guide_download_links = []
    for guide_id, guide_title, guide_pdf_url in guide_rows:
        token = secrets.token_urlsafe(24)
        cur.execute("""
            INSERT INTO guide_downloads (order_id, guide_id, download_token)
            VALUES (%s, %s, %s)
            ON CONFLICT DO NOTHING
        """, (order_id, guide_id, token))
        guide_download_links.append((guide_title, guide_pdf_url))

    cur.execute("SELECT amount FROM orders WHERE id = %s", (order_id,))
    order_amount = float(cur.fetchone()[0])

    conn.commit()
    cur.close()
    conn.close()

    send_confirmation_email(user_email, order_number, order_amount, guide_download_links)
    send_owner_notification(order_number, order_amount, user_name, user_email, user_phone, guide_download_links)

    return {'statusCode': 200, 'headers': HEADERS, 'body': f'OK{inv_id}', 'isBase64Encoded': False}
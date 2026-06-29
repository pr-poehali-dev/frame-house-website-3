CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    order_number VARCHAR(64) UNIQUE NOT NULL,
    user_name VARCHAR(255) NOT NULL,
    user_email VARCHAR(255) NOT NULL,
    user_phone VARCHAR(50),
    amount NUMERIC(10,2) NOT NULL,
    robokassa_inv_id INTEGER UNIQUE,
    status VARCHAR(32) DEFAULT 'pending',
    delivery_address TEXT,
    order_comment TEXT,
    payment_url TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id),
    product_id VARCHAR(128),
    product_name VARCHAR(255),
    product_price NUMERIC(10,2),
    quantity INTEGER DEFAULT 1
);
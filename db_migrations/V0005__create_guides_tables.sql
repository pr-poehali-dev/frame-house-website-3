CREATE TABLE guides (
    id SERIAL PRIMARY KEY,
    slug VARCHAR(128) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    section VARCHAR(64) NOT NULL,
    price NUMERIC(10,2) NOT NULL DEFAULT 149,
    pdf_url TEXT,
    pages_count INTEGER DEFAULT 0,
    emoji VARCHAR(16) DEFAULT '📄',
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE guide_downloads (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id),
    guide_id INTEGER REFERENCES guides(id),
    download_token VARCHAR(64) UNIQUE NOT NULL,
    downloads_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_guide_downloads_order ON guide_downloads(order_id);
CREATE INDEX idx_guide_downloads_token ON guide_downloads(download_token);

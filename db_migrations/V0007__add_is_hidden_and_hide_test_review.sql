ALTER TABLE reviews ADD COLUMN IF NOT EXISTS is_hidden BOOLEAN NOT NULL DEFAULT FALSE;
UPDATE reviews SET is_hidden = TRUE WHERE id = 1 AND name = 'Тестовый пользователь';
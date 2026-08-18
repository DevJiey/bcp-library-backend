CREATE TABLE books (
    id BIGSERIAL PRIMARY KEY,

    isbn VARCHAR(30) UNIQUE,

    title VARCHAR(255) NOT NULL,

    category_id BIGINT
        REFERENCES categories(id)
        ON DELETE SET NULL,

    publisher_id BIGINT
        REFERENCES publishers(id)
        ON DELETE SET NULL,

    publication_year INTEGER
        CHECK (
            publication_year IS NULL
            OR publication_year BETWEEN 1000 AND 9999
        ),

    edition VARCHAR(100),

    description TEXT,

    cover_image_url TEXT,

    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_books_updated_at
BEFORE UPDATE ON books
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
CREATE TABLE book_copies (
    id BIGSERIAL PRIMARY KEY,

    book_id BIGINT NOT NULL
        REFERENCES books(id)
        ON DELETE RESTRICT,

    accession_number VARCHAR(50) UNIQUE NOT NULL,

    barcode VARCHAR(100) UNIQUE NOT NULL,

    shelf_location VARCHAR(100),

    condition VARCHAR(30) NOT NULL DEFAULT 'good'
        CHECK (
            condition IN (
                'excellent',
                'good',
                'fair',
                'poor',
                'damaged',
                'lost'
            )
        ),

    status VARCHAR(30) NOT NULL DEFAULT 'available'
        CHECK (
            status IN (
                'available',
                'borrowed',
                'damaged',
                'lost',
                'maintenance',
                'inactive'
            )
        ),

    acquired_at DATE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_book_copies_updated_at
BEFORE UPDATE ON book_copies
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
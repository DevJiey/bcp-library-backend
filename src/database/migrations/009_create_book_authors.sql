CREATE TABLE book_authors (
    book_id BIGINT NOT NULL
        REFERENCES books(id)
        ON DELETE CASCADE,

    author_id BIGINT NOT NULL
        REFERENCES authors(id)
        ON DELETE RESTRICT,

    author_order INTEGER NOT NULL DEFAULT 1
        CHECK (author_order > 0),

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    PRIMARY KEY (book_id, author_id)
);
CREATE TABLE borrow_transactions (
    id BIGSERIAL PRIMARY KEY,

    borrow_request_id BIGINT UNIQUE NOT NULL
        REFERENCES borrow_requests(id)
        ON DELETE RESTRICT,

    borrower_id BIGINT NOT NULL
        REFERENCES users(id)
        ON DELETE RESTRICT,

    book_copy_id BIGINT NOT NULL
        REFERENCES book_copies(id)
        ON DELETE RESTRICT,

    processed_by BIGINT NOT NULL
        REFERENCES users(id)
        ON DELETE RESTRICT,

    borrowed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    due_at TIMESTAMPTZ NOT NULL,

    returned_at TIMESTAMPTZ,

    status VARCHAR(30) NOT NULL DEFAULT 'borrowed'
        CHECK (
            status IN (
                'borrowed',
                'overdue',
                'returned'
            )
        ),

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CHECK (
        due_at > borrowed_at
    ),

    CHECK (
        returned_at IS NULL
        OR returned_at >= borrowed_at
    )
);

CREATE UNIQUE INDEX unique_active_borrowed_copy
ON borrow_transactions (book_copy_id)
WHERE status IN ('borrowed', 'overdue');

CREATE TRIGGER update_borrow_transactions_updated_at
BEFORE UPDATE ON borrow_transactions
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
CREATE TABLE borrow_requests (
    id BIGSERIAL PRIMARY KEY,

    borrower_id BIGINT NOT NULL
        REFERENCES users(id)
        ON DELETE RESTRICT,

    book_id BIGINT NOT NULL
        REFERENCES books(id)
        ON DELETE RESTRICT,

    status VARCHAR(30) NOT NULL DEFAULT 'pending'
        CHECK (
            status IN (
                'pending',
                'approved',
                'rejected',
                'cancelled'
            )
        ),

    rejection_reason TEXT,

    reviewed_by BIGINT
        REFERENCES users(id)
        ON DELETE SET NULL,

    reviewed_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CHECK (
        (status = 'rejected' AND rejection_reason IS NOT NULL)
        OR
        (status <> 'rejected')
    )
);

CREATE UNIQUE INDEX unique_active_borrow_request
ON borrow_requests (borrower_id, book_id)
WHERE status = 'pending';

CREATE TRIGGER update_borrow_requests_updated_at
BEFORE UPDATE ON borrow_requests
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
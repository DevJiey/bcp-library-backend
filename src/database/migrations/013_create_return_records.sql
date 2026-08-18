CREATE TABLE return_records (
    id BIGSERIAL PRIMARY KEY,

    borrow_transaction_id BIGINT UNIQUE NOT NULL
        REFERENCES borrow_transactions(id)
        ON DELETE RESTRICT,

    processed_by BIGINT NOT NULL
        REFERENCES users(id)
        ON DELETE RESTRICT,

    returned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    condition_on_return VARCHAR(30) NOT NULL
        CHECK (
            condition_on_return IN (
                'excellent',
                'good',
                'fair',
                'poor',
                'damaged',
                'lost'
            )
        ),

    remarks TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_return_records_updated_at
BEFORE UPDATE ON return_records
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
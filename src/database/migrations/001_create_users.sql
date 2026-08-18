CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,

    school_id VARCHAR(50) UNIQUE NOT NULL,

    email VARCHAR(255) UNIQUE NOT NULL,

    password_hash TEXT NOT NULL,

    first_name VARCHAR(100) NOT NULL,

    middle_name VARCHAR(100),

    last_name VARCHAR(100) NOT NULL,

    role VARCHAR(20) NOT NULL
        CHECK (
            role IN (
                'borrower',
                'staff',
                'admin'
            )
        ),

    borrower_type VARCHAR(20)
        CHECK (
            borrower_type IS NULL
            OR borrower_type IN (
                'student',
                'faculty'
            )
        ),

    account_status VARCHAR(20) NOT NULL DEFAULT 'active'
        CHECK (
            account_status IN (
                'active',
                'locked',
                'inactive',
                'suspended'
            )
        ),

    is_first_login BOOLEAN NOT NULL DEFAULT TRUE,

    last_login_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CHECK (
        (role = 'borrower' AND borrower_type IS NOT NULL)
        OR
        (role IN ('staff', 'admin') AND borrower_type IS NULL)
    )
);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
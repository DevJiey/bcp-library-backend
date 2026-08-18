CREATE TABLE publishers (
    id BIGSERIAL PRIMARY KEY,

    name VARCHAR(150) UNIQUE NOT NULL,

    address TEXT,

    contact_email VARCHAR(255),

    contact_number VARCHAR(50),

    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_publishers_updated_at
BEFORE UPDATE ON publishers
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
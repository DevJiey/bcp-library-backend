CREATE TABLE departments (
    id BIGSERIAL PRIMARY KEY,

    code VARCHAR(30) UNIQUE NOT NULL,

    name VARCHAR(150) UNIQUE NOT NULL,

    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_departments_updated_at
BEFORE UPDATE ON departments
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
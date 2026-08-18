CREATE TABLE faculty_profiles (
    id BIGSERIAL PRIMARY KEY,

    user_id BIGINT UNIQUE NOT NULL
        REFERENCES users(id)
        ON DELETE CASCADE,

    department_id BIGINT NOT NULL
        REFERENCES departments(id)
        ON DELETE RESTRICT,

    position VARCHAR(150),

    employment_status VARCHAR(50) NOT NULL DEFAULT 'active',

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_faculty_profiles_updated_at
BEFORE UPDATE ON faculty_profiles
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
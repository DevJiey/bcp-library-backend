CREATE TABLE library_settings (
    id BIGSERIAL PRIMARY KEY,

    setting_key VARCHAR(100) UNIQUE NOT NULL,

    setting_value VARCHAR(255) NOT NULL,

    description TEXT,

    updated_by BIGINT
        REFERENCES users(id)
        ON DELETE SET NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_library_settings_updated_at
BEFORE UPDATE ON library_settings
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
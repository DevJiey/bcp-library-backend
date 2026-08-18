CREATE TABLE announcements (
    id BIGSERIAL PRIMARY KEY,

    title VARCHAR(255) NOT NULL,

    message TEXT NOT NULL,

    audience VARCHAR(30) NOT NULL DEFAULT 'all'
        CHECK (
            audience IN (
                'all',
                'borrowers',
                'students',
                'faculty',
                'staff'
            )
        ),

    status VARCHAR(20) NOT NULL DEFAULT 'published'
        CHECK (
            status IN (
                'draft',
                'published',
                'archived'
            )
        ),

    posted_by BIGINT NOT NULL
        REFERENCES users(id)
        ON DELETE RESTRICT,

    published_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_announcements_updated_at
BEFORE UPDATE ON announcements
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
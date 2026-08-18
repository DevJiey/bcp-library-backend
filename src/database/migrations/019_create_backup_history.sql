CREATE TABLE backup_history (
    id BIGSERIAL PRIMARY KEY,

    initiated_by BIGINT
        REFERENCES users(id)
        ON DELETE SET NULL,

    file_name VARCHAR(255) NOT NULL,

    file_path TEXT,

    file_size BIGINT,

    status VARCHAR(20) NOT NULL DEFAULT 'pending'
        CHECK (
            status IN (
                'pending',
                'completed',
                'failed'
            )
        ),

    error_message TEXT,

    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    completed_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_backup_history_initiated_by
ON backup_history (initiated_by);

CREATE INDEX idx_backup_history_created_at
ON backup_history (created_at);
CREATE TABLE restore_history (
    id BIGSERIAL PRIMARY KEY,

    initiated_by BIGINT
        REFERENCES users(id)
        ON DELETE SET NULL,

    backup_id BIGINT
        REFERENCES backup_history(id)
        ON DELETE SET NULL,

    file_name VARCHAR(255) NOT NULL,

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

CREATE INDEX idx_restore_history_initiated_by
ON restore_history (initiated_by);

CREATE INDEX idx_restore_history_backup_id
ON restore_history (backup_id);

CREATE INDEX idx_restore_history_created_at
ON restore_history (created_at);
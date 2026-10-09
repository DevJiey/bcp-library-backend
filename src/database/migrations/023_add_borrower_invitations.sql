
-- Migration 023: Secure borrower account invitations

-- Allow newly invited borrowers to remain pending
-- until they complete password setup.

ALTER TABLE users
DROP CONSTRAINT IF EXISTS users_account_status_check;

ALTER TABLE users
ADD CONSTRAINT users_account_status_check
CHECK (
    account_status IN (
        'active',
        'inactive',
        'locked',
        'suspended',
        'pending'
    )
);

-- Store secure, one-time invitation tokens.
-- Only the SHA-256 token hash is stored, never the raw token.

CREATE TABLE borrower_invitations (
    id BIGSERIAL PRIMARY KEY,

    user_id BIGINT NOT NULL
        REFERENCES users(id)
        ON DELETE CASCADE,

    token_hash CHAR(64) NOT NULL UNIQUE,

    expires_at TIMESTAMPTZ NOT NULL,

    used_at TIMESTAMPTZ,

    revoked_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT borrower_invitations_expiry_check
        CHECK (expires_at > created_at)
);

-- Only one unused, unrevoked invitation per borrower.
CREATE UNIQUE INDEX idx_borrower_invitations_open_user
ON borrower_invitations(user_id)
WHERE used_at IS NULL AND revoked_at IS NULL;

CREATE INDEX idx_borrower_invitations_user_id
ON borrower_invitations(user_id);

CREATE INDEX idx_borrower_invitations_expires_at
ON borrower_invitations(expires_at);

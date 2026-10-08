
-- Track daily AI chat requests per authenticated user.
CREATE TABLE IF NOT EXISTS ai_user_daily_usage (
    user_id BIGINT NOT NULL
        REFERENCES users(id) ON DELETE CASCADE,

    usage_date DATE NOT NULL,

    request_count INTEGER NOT NULL DEFAULT 0
        CHECK (request_count >= 0),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    PRIMARY KEY (user_id, usage_date)
);

-- Track daily Gemini API call reservations
-- across all backend instances.
CREATE TABLE IF NOT EXISTS ai_global_daily_usage (
    usage_date DATE PRIMARY KEY,

    api_call_count INTEGER NOT NULL DEFAULT 0
        CHECK (api_call_count >= 0),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS
    idx_ai_user_daily_usage_date
ON ai_user_daily_usage (usage_date);

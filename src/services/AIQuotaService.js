
const pool = require("../config/database");

// Read and validate positive integer limits.
const readPositiveInteger = (value, fallback) => {
    if (value === undefined || value === "") {
        return fallback;
    }

    const parsed = Number(value);

    if (
        !Number.isSafeInteger(parsed) ||
        parsed <= 0
    ) {
        throw new Error(
            "AI quota limits must be positive integers."
        );
    }

    return parsed;
};

const MAX_USER_DAILY_REQUESTS =
    readPositiveInteger(
        process.env.AI_USER_DAILY_LIMIT,
        10
    );

const MAX_GLOBAL_DAILY_API_CALLS =
    readPositiveInteger(
        process.env.AI_GLOBAL_DAILY_LIMIT,
        300
    );

const RESERVED_CALLS_PER_CHAT = 3;

const reserveAIQuota = async (userId) => {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        // Use a consistent UTC date from PostgreSQL.
        const dateResult = await client.query(`
            SELECT (NOW() AT TIME ZONE 'UTC')::DATE
                AS usage_date
        `);

        const usageDate = dateResult.rows[0].usage_date;

        // Atomically reserve global Gemini API budget.
        const globalResult = await client.query(
            `
            INSERT INTO ai_global_daily_usage (
                usage_date,
                api_call_count
            )
            VALUES ($1, $2)
            ON CONFLICT (usage_date)
            DO UPDATE SET
                api_call_count =
                    ai_global_daily_usage.api_call_count
                    + EXCLUDED.api_call_count,
                updated_at = NOW()
            WHERE
                ai_global_daily_usage.api_call_count
                + EXCLUDED.api_call_count <= $3
            RETURNING api_call_count
            `,
            [
                usageDate,
                RESERVED_CALLS_PER_CHAT,
                MAX_GLOBAL_DAILY_API_CALLS,
            ]
        );

        if (globalResult.rowCount === 0) {
            await client.query("ROLLBACK");

            return {
                allowed: false,
                status: 429,
                message:
                    "The library AI assistant has reached " +
                    "its daily usage limit. Please try again tomorrow.",
            };
        }

        // Atomically reserve one chat request for the user.
        const userResult = await client.query(
            `
            INSERT INTO ai_user_daily_usage (
                user_id,
                usage_date,
                request_count
            )
            VALUES ($1, $2, 1)
            ON CONFLICT (user_id, usage_date)
            DO UPDATE SET
                request_count =
                    ai_user_daily_usage.request_count + 1,
                updated_at = NOW()
            WHERE
                ai_user_daily_usage.request_count < $3
            RETURNING request_count
            `,
            [
                userId,
                usageDate,
                MAX_USER_DAILY_REQUESTS,
            ]
        );

        if (userResult.rowCount === 0) {
            await client.query("ROLLBACK");

            return {
                allowed: false,
                status: 429,
                message:
                    "You have reached your daily limit of " +
                    MAX_USER_DAILY_REQUESTS +
                    " AI messages. Please try again tomorrow.",
            };
        }

        await client.query("COMMIT");

        return {
            allowed: true,
            remaining:
                MAX_USER_DAILY_REQUESTS -
                userResult.rows[0].request_count,
        };
    } catch (error) {
        try {
            await client.query("ROLLBACK");
        } catch (_) {
            // Preserve the original database error.
        }

        throw error;
    } finally {
        client.release();
    }
};

module.exports = {
    reserveAIQuota,
};

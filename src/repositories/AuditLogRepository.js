const pool = require("../config/database");

const createAuditLog = async ({
    userId,
    action,
    module,
    entityType,
    entityId,
    description,
    ipAddress,
    userAgent,
}) => {
    const result = await pool.query(
        `
        INSERT INTO audit_logs (
            user_id,
            action,
            module,
            entity_type,
            entity_id,
            description,
            ip_address,
            user_agent
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *
        `,
        [
            userId || null,
            action,
            module,
            entityType || null,
            entityId || null,
            description || null,
            ipAddress || null,
            userAgent || null,
        ]
    );

    return result.rows[0];
};

const getAuditLogs = async ({
    userId,
    action,
    module,
    entityType,
    limit = 100,
    offset = 0,
}) => {
    const result = await pool.query(
        `
        SELECT
            al.id,
            al.user_id,
            al.action,
            al.module,
            al.entity_type,
            al.entity_id,
            al.description,
            al.ip_address,
            al.user_agent,
            al.created_at,

            u.school_id,
            u.first_name,
            u.middle_name,
            u.last_name,
            u.role

        FROM audit_logs al

        LEFT JOIN users u
            ON u.id = al.user_id

        WHERE
            ($1::bigint IS NULL OR al.user_id = $1)

            AND (
                $2::text IS NULL
                OR al.action = $2
            )

            AND (
                $3::text IS NULL
                OR al.module = $3
            )

            AND (
                $4::text IS NULL
                OR al.entity_type = $4
            )

        ORDER BY al.created_at DESC

        LIMIT $5
        OFFSET $6
        `,
        [
            userId || null,
            action || null,
            module || null,
            entityType || null,
            limit,
            offset,
        ]
    );

    return result.rows;
};

const countAuditLogs = async ({
    userId,
    action,
    module,
    entityType,
}) => {
    const result = await pool.query(
        `
        SELECT COUNT(*)::int AS count

        FROM audit_logs al

        WHERE
            ($1::bigint IS NULL OR al.user_id = $1)

            AND (
                $2::text IS NULL
                OR al.action = $2
            )

            AND (
                $3::text IS NULL
                OR al.module = $3
            )

            AND (
                $4::text IS NULL
                OR al.entity_type = $4
            )
        `,
        [
            userId || null,
            action || null,
            module || null,
            entityType || null,
        ]
    );

    return result.rows[0].count;
};

module.exports = {
    createAuditLog,
    getAuditLogs,
    countAuditLogs,
};
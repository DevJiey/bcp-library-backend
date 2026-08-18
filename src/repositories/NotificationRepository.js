const pool = require("../config/database");

const createNotification = async ({
    userId,
    type,
    title,
    message,
    relatedEntityType,
    relatedEntityId,
}) => {
    const result = await pool.query(
        `
        INSERT INTO notifications (
            user_id,
            type,
            title,
            message,
            related_entity_type,
            related_entity_id,
            is_read
        )
        VALUES (
            $1, $2, $3, $4, $5, $6, FALSE
        )
        RETURNING *
        `,
        [
            userId,
            type,
            title,
            message,
            relatedEntityType || null,
            relatedEntityId || null,
        ]
    );

    return result.rows[0];
};

const getNotificationsByUser = async (userId) => {
    const result = await pool.query(
        `
        SELECT
            id,
            type,
            title,
            message,
            related_entity_type,
            related_entity_id,
            is_read,
            read_at,
            created_at
        FROM notifications
        WHERE user_id = $1
        ORDER BY created_at DESC
        `,
        [userId]
    );

    return result.rows;
};

const getUnreadNotificationCount = async (userId) => {
    const result = await pool.query(
        `
        SELECT COUNT(*)::int AS count
        FROM notifications
        WHERE user_id = $1
          AND is_read = FALSE
        `,
        [userId]
    );

    return result.rows[0].count;
};

const getNotificationById = async ({
    notificationId,
    userId,
}) => {
    const result = await pool.query(
        `
        SELECT
            id,
            user_id,
            type,
            title,
            message,
            related_entity_type,
            related_entity_id,
            is_read,
            read_at,
            created_at
        FROM notifications
        WHERE id = $1
          AND user_id = $2
        LIMIT 1
        `,
        [
            notificationId,
            userId,
        ]
    );

    return result.rows[0] || null;
};

const markNotificationAsRead = async ({
    notificationId,
    userId,
}) => {
    const result = await pool.query(
        `
        UPDATE notifications
        SET
            is_read = TRUE,
            read_at = COALESCE(read_at, NOW())
        WHERE id = $1
          AND user_id = $2
        RETURNING *
        `,
        [
            notificationId,
            userId,
        ]
    );

    return result.rows[0] || null;
};

const markAllNotificationsAsRead = async (userId) => {
    const result = await pool.query(
        `
        UPDATE notifications
        SET
            is_read = TRUE,
            read_at = COALESCE(read_at, NOW())
        WHERE user_id = $1
          AND is_read = FALSE
        RETURNING id
        `,
        [userId]
    );

    return result.rows;
};

module.exports = {
    createNotification,
    getNotificationsByUser,
    getUnreadNotificationCount,
    getNotificationById,
    markNotificationAsRead,
    markAllNotificationsAsRead,
};
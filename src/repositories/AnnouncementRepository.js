const pool = require("../config/database");

const createAnnouncement = async ({
    title,
    message,
    audience,
    status,
    postedBy,
}) => {
    const result = await pool.query(
        `
        INSERT INTO announcements (
            title,
            message,
            audience,
            status,
            posted_by,
            published_at
        )
        VALUES (
            $1,
            $2,
            $3,
            $4::varchar,
            $5,
            CASE
                WHEN $4::varchar = 'published'
                THEN NOW()
                ELSE NULL
            END
        )
        RETURNING *
        `,
        [
            title,
            message,
            audience,
            status,
            postedBy,
        ]
    );

    return result.rows[0];
};

const getAllAnnouncements = async () => {
    const result = await pool.query(
        `
        SELECT
            a.id,
            a.title,
            a.message,
            a.audience,
            a.status,
            a.published_at,
            a.created_at,
            a.updated_at,

            u.first_name AS posted_by_first_name,
            u.middle_name AS posted_by_middle_name,
            u.last_name AS posted_by_last_name

        FROM announcements a

        INNER JOIN users u
            ON u.id = a.posted_by

        ORDER BY a.created_at DESC
        `
    );

    return result.rows;
};

const getPublishedAnnouncementsForUser = async ({
    role,
    borrowerType,
}) => {
    const result = await pool.query(
        `
        SELECT
            a.id,
            a.title,
            a.message,
            a.audience,
            a.published_at,
            a.created_at

        FROM announcements a

        WHERE a.status = 'published'

          AND (
              a.audience = 'all'

              OR (
                  a.audience = 'borrowers'
                  AND $1 = 'borrower'
              )

              OR (
                  a.audience = 'students'
                  AND $1 = 'borrower'
                  AND $2 = 'student'
              )

              OR (
                  a.audience = 'faculty'
                  AND $1 = 'borrower'
                  AND $2 = 'faculty'
              )

              OR (
                  a.audience = 'staff'
                  AND $1 = 'staff'
              )
          )

        ORDER BY a.published_at DESC
        `,
        [
            role,
            borrowerType || null,
        ]
    );

    return result.rows;
};

const getAnnouncementById = async (announcementId) => {
    const result = await pool.query(
        `
        SELECT *
        FROM announcements
        WHERE id = $1
        LIMIT 1
        `,
        [announcementId]
    );

    return result.rows[0] || null;
};

const updateAnnouncement = async ({
    announcementId,
    title,
    message,
    audience,
    status,
}) => {
    const result = await pool.query(
        `
        UPDATE announcements

        SET
            title = $1,
            message = $2,
            audience = $3,
            status = $4::varchar,
            published_at = CASE
                WHEN $4::varchar = 'published'
                     AND published_at IS NULL
                THEN NOW()

                WHEN $4::varchar <> 'published'
                THEN NULL

                ELSE published_at
            END

        WHERE id = $5

        RETURNING *
        `,
        [
            title,
            message,
            audience,
            status,
            announcementId,
        ]
    );

    return result.rows[0] || null;
};

const getTargetUsers = async (audience) => {
    let condition = "";

    if (audience === "all") {
        condition = `
            account_status IN ('active', 'locked')
        `;
    }

    if (audience === "borrowers") {
        condition = `
            role = 'borrower'
            AND account_status IN ('active', 'locked')
        `;
    }

    if (audience === "students") {
        condition = `
            role = 'borrower'
            AND borrower_type = 'student'
            AND account_status IN ('active', 'locked')
        `;
    }

    if (audience === "faculty") {
        condition = `
            role = 'borrower'
            AND borrower_type = 'faculty'
            AND account_status IN ('active', 'locked')
        `;
    }

    if (audience === "staff") {
        condition = `
            role = 'staff'
            AND account_status = 'active'
        `;
    }

    const result = await pool.query(
        `
        SELECT id
        FROM users
        WHERE ${condition}
        `
    );

    return result.rows;
};

const createAnnouncementNotifications = async ({
    userIds,
    announcementId,
    title,
    message,
}) => {
    if (!userIds || userIds.length === 0) {
        return [];
    }

    const result = await pool.query(
        `
        INSERT INTO notifications (
            user_id,
            type,
            title,
            message,
            related_entity_type,
            related_entity_id
        )

        SELECT
            UNNEST($1::bigint[]),
            'announcement',
            $2,
            $3,
            'announcement',
            $4

        RETURNING *
        `,
        [
            userIds,
            title,
            message,
            announcementId,
        ]
    );

    return result.rows;
};

module.exports = {
    createAnnouncement,
    getAllAnnouncements,
    getPublishedAnnouncementsForUser,
    getAnnouncementById,
    updateAnnouncement,
    getTargetUsers,
    createAnnouncementNotifications,
};
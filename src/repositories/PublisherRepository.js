const pool = require("../config/database");

const createPublisher = async ({
    name,
    address,
    contactEmail,
    contactNumber,
}) => {
    const result = await pool.query(
        `
        INSERT INTO publishers (
            name,
            address,
            contact_email,
            contact_number
        )
        VALUES ($1, $2, $3, $4)
        RETURNING *
        `,
        [
            name,
            address || null,
            contactEmail || null,
            contactNumber || null,
        ]
    );

    return result.rows[0];
};

const getAllPublishers = async () => {
    const result = await pool.query(
        `
        SELECT
            id,
            name,
            address,
            contact_email,
            contact_number,
            is_active,
            created_at,
            updated_at
        FROM publishers
        ORDER BY name ASC
        `
    );

    return result.rows;
};

const getPublisherById = async (publisherId) => {
    const result = await pool.query(
        `
        SELECT
            id,
            name,
            address,
            contact_email,
            contact_number,
            is_active,
            created_at,
            updated_at
        FROM publishers
        WHERE id = $1
        LIMIT 1
        `,
        [publisherId]
    );

    return result.rows[0] || null;
};

const findPublisherByName = async (name) => {
    const result = await pool.query(
        `
        SELECT id
        FROM publishers
        WHERE LOWER(name) = LOWER($1)
        LIMIT 1
        `,
        [name]
    );

    return result.rows[0] || null;
};

const updatePublisher = async ({
    publisherId,
    name,
    address,
    contactEmail,
    contactNumber,
    isActive,
}) => {
    const result = await pool.query(
        `
        UPDATE publishers
        SET
            name = $1,
            address = $2,
            contact_email = $3,
            contact_number = $4,
            is_active = $5
        WHERE id = $6
        RETURNING *
        `,
        [
            name,
            address || null,
            contactEmail || null,
            contactNumber || null,
            isActive,
            publisherId,
        ]
    );

    return result.rows[0] || null;
};

module.exports = {
    createPublisher,
    getAllPublishers,
    getPublisherById,
    findPublisherByName,
    updatePublisher,
};
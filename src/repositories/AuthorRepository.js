const pool = require("../config/database");

const createAuthor = async ({
    firstName,
    middleName,
    lastName,
}) => {
    const result = await pool.query(
        `
        INSERT INTO authors (
            first_name,
            middle_name,
            last_name
        )
        VALUES ($1, $2, $3)
        RETURNING *
        `,
        [
            firstName,
            middleName || null,
            lastName,
        ]
    );

    return result.rows[0];
};

const getAllAuthors = async () => {
    const result = await pool.query(
        `
        SELECT
            id,
            first_name,
            middle_name,
            last_name,
            is_active,
            created_at,
            updated_at
        FROM authors
        ORDER BY last_name ASC, first_name ASC
        `
    );

    return result.rows;
};

const getAuthorById = async (authorId) => {
    const result = await pool.query(
        `
        SELECT
            id,
            first_name,
            middle_name,
            last_name,
            is_active,
            created_at,
            updated_at
        FROM authors
        WHERE id = $1
        LIMIT 1
        `,
        [authorId]
    );

    return result.rows[0] || null;
};

const findAuthorByName = async ({
    firstName,
    middleName,
    lastName,
}) => {
    const result = await pool.query(
        `
        SELECT id
        FROM authors
        WHERE LOWER(first_name) = LOWER($1)
          AND LOWER(last_name) = LOWER($2)
          AND COALESCE(LOWER(middle_name), '') =
              COALESCE(LOWER($3), '')
        LIMIT 1
        `,
        [
            firstName,
            lastName,
            middleName || null,
        ]
    );

    return result.rows[0] || null;
};

const updateAuthor = async ({
    authorId,
    firstName,
    middleName,
    lastName,
    isActive,
}) => {
    const result = await pool.query(
        `
        UPDATE authors
        SET
            first_name = $1,
            middle_name = $2,
            last_name = $3,
            is_active = $4
        WHERE id = $5
        RETURNING *
        `,
        [
            firstName,
            middleName || null,
            lastName,
            isActive,
            authorId,
        ]
    );

    return result.rows[0] || null;
};

module.exports = {
    createAuthor,
    getAllAuthors,
    getAuthorById,
    findAuthorByName,
    updateAuthor,
};
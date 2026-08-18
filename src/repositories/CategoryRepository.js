const pool = require("../config/database");

const createCategory = async ({ name, description }) => {
    const result = await pool.query(
        `
        INSERT INTO categories (
            name,
            description
        )
        VALUES ($1, $2)
        RETURNING *
        `,
        [
            name,
            description || null,
        ]
    );

    return result.rows[0];
};

const getAllCategories = async () => {
    const result = await pool.query(
        `
        SELECT
            id,
            name,
            description,
            is_active,
            created_at,
            updated_at
        FROM categories
        ORDER BY name ASC
        `
    );

    return result.rows;
};

const getCategoryById = async (categoryId) => {
    const result = await pool.query(
        `
        SELECT
            id,
            name,
            description,
            is_active,
            created_at,
            updated_at
        FROM categories
        WHERE id = $1
        LIMIT 1
        `,
        [categoryId]
    );

    return result.rows[0] || null;
};

const findCategoryByName = async (name) => {
    const result = await pool.query(
        `
        SELECT id
        FROM categories
        WHERE LOWER(name) = LOWER($1)
        LIMIT 1
        `,
        [name]
    );

    return result.rows[0] || null;
};

const updateCategory = async ({
    categoryId,
    name,
    description,
    isActive,
}) => {
    const result = await pool.query(
        `
        UPDATE categories
        SET
            name = $1,
            description = $2,
            is_active = $3
        WHERE id = $4
        RETURNING *
        `,
        [
            name,
            description || null,
            isActive,
            categoryId,
        ]
    );

    return result.rows[0] || null;
};

module.exports = {
    createCategory,
    getAllCategories,
    getCategoryById,
    findCategoryByName,
    updateCategory,
};
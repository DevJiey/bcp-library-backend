const pool = require("../config/database");

const findUserBySchoolId = async (schoolId) => {
    const result = await pool.query(
        `
        SELECT
            id,
            school_id,
            email,
            password_hash,
            first_name,
            middle_name,
            last_name,
            role,
            borrower_type,
            account_status,
            is_first_login,
            last_login_at
        FROM users
        WHERE school_id = $1
        LIMIT 1
        `,
        [schoolId]
    );

    return result.rows[0] || null;
};

const findUserById = async (userId) => {
    const result = await pool.query(
        `
        SELECT
            id,
            school_id,
            email,
            first_name,
            middle_name,
            last_name,
            role,
            borrower_type,
            account_status,
            is_first_login,
            last_login_at,
            created_at,
            updated_at
        FROM users
        WHERE id = $1
        LIMIT 1
        `,
        [userId]
    );

    return result.rows[0] || null;
};

const updateLastLogin = async (userId) => {
    await pool.query(
        `
        UPDATE users
        SET last_login_at = NOW()
        WHERE id = $1
        `,
        [userId]
    );
};

module.exports = {
    findUserBySchoolId,
    findUserById,
    updateLastLogin,
};
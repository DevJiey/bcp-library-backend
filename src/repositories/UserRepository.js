const pool = require("../config/database");

const findUserBySchoolId = async (schoolId) => {
    const result = await pool.query(
        `
        SELECT id
        FROM users
        WHERE school_id = $1
        LIMIT 1
        `,
        [schoolId]
    );

    return result.rows[0] || null;
};

const findUserByEmail = async (email) => {
    const result = await pool.query(
        `
        SELECT id
        FROM users
        WHERE email = $1
        LIMIT 1
        `,
        [email]
    );

    return result.rows[0] || null;
};

const createUser = async ({
    schoolId,
    email,
    passwordHash,
    firstName,
    middleName,
    lastName,
    role,
    borrowerType,
}) => {
    const result = await pool.query(
        `
        INSERT INTO users (
            school_id,
            email,
            password_hash,
            first_name,
            middle_name,
            last_name,
            role,
            borrower_type,
            account_status,
            is_first_login
        )
        VALUES (
            $1, $2, $3, $4, $5,
            $6, $7, $8, 'active', TRUE
        )
        RETURNING
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
            created_at
        `,
        [
            schoolId,
            email,
            passwordHash,
            firstName,
            middleName || null,
            lastName,
            role,
            borrowerType || null,
        ]
    );

    return result.rows[0];
};

const createStudentProfile = async ({
    userId,
    program,
    yearLevel,
    section,
}) => {
    const result = await pool.query(
        `
        INSERT INTO student_profiles (
            user_id,
            program,
            year_level,
            section
        )
        VALUES ($1, $2, $3, $4)
        RETURNING *
        `,
        [
            userId,
            program,
            yearLevel,
            section || null,
        ]
    );

    return result.rows[0];
};

const createFacultyProfile = async ({
    userId,
    departmentId,
    position,
    employmentStatus,
}) => {
    const result = await pool.query(
        `
        INSERT INTO faculty_profiles (
            user_id,
            department_id,
            position,
            employment_status
        )
        VALUES ($1, $2, $3, $4)
        RETURNING *
        `,
        [
            userId,
            departmentId,
            position || null,
            employmentStatus,
        ]
    );

    return result.rows[0];
};

const getAllUsers = async () => {
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
        ORDER BY created_at DESC
        `
    );

    return result.rows;
};

const getAllBorrowers = async () => {
    const result = await pool.query(
        `
        SELECT
            id,
            school_id,
            email,
            first_name,
            middle_name,
            last_name,
            borrower_type,
            account_status,
            is_first_login,
            last_login_at,
            created_at,
            updated_at
        FROM users
        WHERE role = 'borrower'
        ORDER BY created_at DESC
        `
    );

    return result.rows;
};

const getUserById = async (userId) => {
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

const getStudentProfileByUserId = async (userId) => {
    const result = await pool.query(
        `
        SELECT
            id,
            user_id,
            program,
            year_level,
            section,
            created_at,
            updated_at
        FROM student_profiles
        WHERE user_id = $1
        LIMIT 1
        `,
        [userId]
    );

    return result.rows[0] || null;
};

const getFacultyProfileByUserId = async (userId) => {
    const result = await pool.query(
        `
        SELECT
            fp.id,
            fp.user_id,
            fp.department_id,
            fp.position,
            fp.employment_status,
            fp.created_at,
            fp.updated_at,
            d.name AS department_name
        FROM faculty_profiles fp
        LEFT JOIN departments d
            ON d.id = fp.department_id
        WHERE fp.user_id = $1
        LIMIT 1
        `,
        [userId]
    );

    return result.rows[0] || null;
};

const updateUserProfile = async ({
    userId,
    email,
    firstName,
    middleName,
    lastName,
}) => {
    const result = await pool.query(
        `
        UPDATE users
        SET
            email = $1,
            first_name = $2,
            middle_name = $3,
            last_name = $4
        WHERE id = $5
        RETURNING
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
        `,
        [
            email,
            firstName,
            middleName || null,
            lastName,
            userId,
        ]
    );

    return result.rows[0] || null;
};

const updateStudentProfile = async ({
    userId,
    program,
    yearLevel,
    section,
}) => {
    const result = await pool.query(
        `
        UPDATE student_profiles
        SET
            program = $1,
            year_level = $2,
            section = $3
        WHERE user_id = $4
        RETURNING *
        `,
        [
            program,
            yearLevel,
            section || null,
            userId,
        ]
    );

    return result.rows[0] || null;
};

const updateFacultyProfile = async ({
    userId,
    departmentId,
    position,
    employmentStatus,
}) => {
    const result = await pool.query(
        `
        UPDATE faculty_profiles
        SET
            department_id = $1,
            position = $2,
            employment_status = $3
        WHERE user_id = $4
        RETURNING *
        `,
        [
            departmentId,
            position || null,
            employmentStatus,
            userId,
        ]
    );

    return result.rows[0] || null;
};

const updateUserStatus = async ({
    userId,
    accountStatus,
}) => {
    const result = await pool.query(
        `
        UPDATE users
        SET account_status = $1
        WHERE id = $2
        RETURNING
            id,
            school_id,
            email,
            first_name,
            middle_name,
            last_name,
            role,
            borrower_type,
            account_status,
            updated_at
        `,
        [
            accountStatus,
            userId,
        ]
    );

    return result.rows[0] || null;
};

module.exports = {
    findUserBySchoolId,
    findUserByEmail,
    createUser,
    createStudentProfile,
    createFacultyProfile,
    getAllUsers,
    getAllBorrowers,
    getUserById,
    getStudentProfileByUserId,
    getFacultyProfileByUserId,
    updateUserProfile,
    updateStudentProfile,
    updateFacultyProfile,
    updateUserStatus,
};
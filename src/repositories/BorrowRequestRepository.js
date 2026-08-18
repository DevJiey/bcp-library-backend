const pool = require("../config/database");

const getBorrowerById = async (borrowerId) => {
    const result = await pool.query(
        `
        SELECT
            id,
            role,
            borrower_type,
            account_status
        FROM users
        WHERE id = $1
        LIMIT 1
        `,
        [borrowerId]
    );

    return result.rows[0] || null;
};

const getBookById = async (bookId) => {
    const result = await pool.query(
        `
        SELECT
            id,
            title,
            is_active
        FROM books
        WHERE id = $1
        LIMIT 1
        `,
        [bookId]
    );

    return result.rows[0] || null;
};

const countAvailableCopies = async (bookId) => {
    const result = await pool.query(
        `
        SELECT COUNT(*)::int AS count
        FROM book_copies
        WHERE book_id = $1
          AND status = 'available'
        `,
        [bookId]
    );

    return result.rows[0].count;
};

const findPendingRequest = async ({
    borrowerId,
    bookId,
}) => {
    const result = await pool.query(
        `
        SELECT id
        FROM borrow_requests
        WHERE borrower_id = $1
          AND book_id = $2
          AND status = 'pending'
        LIMIT 1
        `,
        [
            borrowerId,
            bookId,
        ]
    );

    return result.rows[0] || null;
};

const countActiveBorrowings = async (borrowerId) => {
    const result = await pool.query(
        `
        SELECT COUNT(*)::int AS count
        FROM borrow_transactions
        WHERE borrower_id = $1
          AND status IN ('borrowed', 'overdue')
        `,
        [borrowerId]
    );

    return result.rows[0].count;
};

const getLibrarySetting = async (settingKey) => {
    const result = await pool.query(
        `
        SELECT setting_value
        FROM library_settings
        WHERE setting_key = $1
        LIMIT 1
        `,
        [settingKey]
    );

    return result.rows[0] || null;
};

const createBorrowRequest = async ({
    borrowerId,
    bookId,
}) => {
    const result = await pool.query(
        `
        INSERT INTO borrow_requests (
            borrower_id,
            book_id
        )
        VALUES ($1, $2)
        RETURNING *
        `,
        [
            borrowerId,
            bookId,
        ]
    );

    return result.rows[0];
};

const getBorrowRequestsByBorrower = async (borrowerId) => {
    const result = await pool.query(
        `
        SELECT
            br.id,
            br.book_id,
            br.status,
            br.rejection_reason,
            br.reviewed_at,
            br.created_at,
            br.updated_at,

            b.isbn,
            b.title,
            b.cover_image_url

        FROM borrow_requests br

        INNER JOIN books b
            ON b.id = br.book_id

        WHERE br.borrower_id = $1

        ORDER BY br.created_at DESC
        `,
        [borrowerId]
    );

    return result.rows;
};

module.exports = {
    getBorrowerById,
    getBookById,
    countAvailableCopies,
    findPendingRequest,
    countActiveBorrowings,
    getLibrarySetting,
    createBorrowRequest,
    getBorrowRequestsByBorrower,
};
const pool = require("../config/database");

const getLibraryOverview = async () => {
    const result = await pool.query(
        `
        SELECT
            (
                SELECT COUNT(*)::int
                FROM books
                WHERE is_active = TRUE
            ) AS total_books,

            (
                SELECT COUNT(*)::int
                FROM book_copies
                WHERE status <> 'inactive'
            ) AS total_copies,

            (
                SELECT COUNT(*)::int
                FROM book_copies
                WHERE status = 'available'
            ) AS available_copies,

            (
                SELECT COUNT(*)::int
                FROM book_copies
                WHERE status = 'borrowed'
            ) AS borrowed_copies,

            (
                SELECT COUNT(*)::int
                FROM users
                WHERE role = 'borrower'
            ) AS total_borrowers,

            (
                SELECT COUNT(*)::int
                FROM borrow_transactions
                WHERE status IN ('borrowed', 'overdue')
            ) AS active_borrowings,

            (
                SELECT COUNT(*)::int
                FROM borrow_transactions
                WHERE status = 'overdue'
            ) AS overdue_borrowings,

            (
                SELECT COUNT(*)::int
                FROM borrow_transactions
                WHERE status = 'returned'
            ) AS returned_transactions,

            (
                SELECT COUNT(*)::int
                FROM borrow_requests
                WHERE status = 'pending'
            ) AS pending_borrow_requests
        `
    );

    return result.rows[0];
};

const getBorrowingSummary = async () => {
    const result = await pool.query(
        `
        SELECT
            status,
            COUNT(*)::int AS total

        FROM borrow_transactions

        GROUP BY status

        ORDER BY status ASC
        `
    );

    return result.rows;
};

const getBorrowRequestSummary = async () => {
    const result = await pool.query(
        `
        SELECT
            status,
            COUNT(*)::int AS total

        FROM borrow_requests

        GROUP BY status

        ORDER BY status ASC
        `
    );

    return result.rows;
};

const getMostBorrowedBooks = async (limit = 10) => {
    const result = await pool.query(
        `
        SELECT
            b.id,
            b.isbn,
            b.title,
            COUNT(bt.id)::int AS borrow_count

        FROM books b

        INNER JOIN book_copies bc
            ON bc.book_id = b.id

        INNER JOIN borrow_transactions bt
            ON bt.book_copy_id = bc.id

        GROUP BY
            b.id,
            b.isbn,
            b.title

        ORDER BY borrow_count DESC, b.title ASC

        LIMIT $1
        `,
        [limit]
    );

    return result.rows;
};

const getOverdueReport = async () => {
    const result = await pool.query(
        `
        SELECT
            bt.id AS transaction_id,
            bt.borrowed_at,
            bt.due_at,
            bt.status,

            u.id AS borrower_id,
            u.school_id,
            u.first_name,
            u.middle_name,
            u.last_name,
            u.borrower_type,
            u.account_status,

            b.id AS book_id,
            b.title,

            bc.accession_number,
            bc.barcode

        FROM borrow_transactions bt

        INNER JOIN users u
            ON u.id = bt.borrower_id

        INNER JOIN book_copies bc
            ON bc.id = bt.book_copy_id

        INNER JOIN books b
            ON b.id = bc.book_id

        WHERE bt.status = 'overdue'

        ORDER BY bt.due_at ASC
        `
    );

    return result.rows;
};

module.exports = {
    getLibraryOverview,
    getBorrowingSummary,
    getBorrowRequestSummary,
    getMostBorrowedBooks,
    getOverdueReport,
};
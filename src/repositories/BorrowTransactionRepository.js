const pool = require("../config/database");

const getBorrowTransactionsByBorrower = async (borrowerId) => {
    const result = await pool.query(
        `
        SELECT
            bt.id,
            bt.borrow_request_id,
            bt.book_copy_id,
            bt.borrowed_at,
            bt.due_at,
            bt.returned_at,
            bt.status,
            bt.created_at,
            bt.updated_at,

            b.id AS book_id,
            b.isbn,
            b.title,
            b.cover_image_url,

            bc.accession_number,
            bc.barcode,
            bc.shelf_location,
            bc.condition

        FROM borrow_transactions bt

        INNER JOIN book_copies bc
            ON bc.id = bt.book_copy_id

        INNER JOIN books b
            ON b.id = bc.book_id

        WHERE bt.borrower_id = $1

        ORDER BY bt.borrowed_at DESC
        `,
        [borrowerId]
    );

    return result.rows;
};

const getActiveBorrowTransactionsByBorrower = async (borrowerId) => {
    const result = await pool.query(
        `
        SELECT
            bt.id,
            bt.borrow_request_id,
            bt.book_copy_id,
            bt.borrowed_at,
            bt.due_at,
            bt.status,

            b.id AS book_id,
            b.isbn,
            b.title,
            b.cover_image_url,

            bc.accession_number,
            bc.barcode,
            bc.shelf_location

        FROM borrow_transactions bt

        INNER JOIN book_copies bc
            ON bc.id = bt.book_copy_id

        INNER JOIN books b
            ON b.id = bc.book_id

        WHERE bt.borrower_id = $1
          AND bt.status IN ('borrowed', 'overdue')

        ORDER BY bt.due_at ASC
        `,
        [borrowerId]
    );

    return result.rows;
};

module.exports = {
    getBorrowTransactionsByBorrower,
    getActiveBorrowTransactionsByBorrower,
};
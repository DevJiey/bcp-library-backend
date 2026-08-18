const pool = require("../config/database");

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

const findCopyByAccessionNumber = async (accessionNumber) => {
    const result = await pool.query(
        `
        SELECT id
        FROM book_copies
        WHERE accession_number = $1
        LIMIT 1
        `,
        [accessionNumber]
    );

    return result.rows[0] || null;
};

const findCopyByBarcode = async (barcode) => {
    const result = await pool.query(
        `
        SELECT id
        FROM book_copies
        WHERE barcode = $1
        LIMIT 1
        `,
        [barcode]
    );

    return result.rows[0] || null;
};

const createBookCopy = async ({
    bookId,
    accessionNumber,
    barcode,
    shelfLocation,
    condition,
    acquiredAt,
}) => {
    const result = await pool.query(
        `
        INSERT INTO book_copies (
            book_id,
            accession_number,
            barcode,
            shelf_location,
            condition,
            acquired_at
        )
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
        `,
        [
            bookId,
            accessionNumber,
            barcode,
            shelfLocation || null,
            condition || "good",
            acquiredAt || null,
        ]
    );

    return result.rows[0];
};

const getAllBookCopies = async () => {
    const result = await pool.query(
        `
        SELECT
            bc.id,
            bc.book_id,
            bc.accession_number,
            bc.barcode,
            bc.shelf_location,
            bc.condition,
            bc.status,
            bc.acquired_at,
            bc.created_at,
            bc.updated_at,

            b.isbn,
            b.title

        FROM book_copies bc

        INNER JOIN books b
            ON b.id = bc.book_id

        ORDER BY b.title ASC, bc.accession_number ASC
        `
    );

    return result.rows;
};

const getCopiesByBookId = async (bookId) => {
    const result = await pool.query(
        `
        SELECT
            bc.id,
            bc.book_id,
            bc.accession_number,
            bc.barcode,
            bc.shelf_location,
            bc.condition,
            bc.status,
            bc.acquired_at,
            bc.created_at,
            bc.updated_at

        FROM book_copies bc

        WHERE bc.book_id = $1

        ORDER BY bc.accession_number ASC
        `,
        [bookId]
    );

    return result.rows;
};

const getBookCopyById = async (copyId) => {
    const result = await pool.query(
        `
        SELECT
            bc.id,
            bc.book_id,
            bc.accession_number,
            bc.barcode,
            bc.shelf_location,
            bc.condition,
            bc.status,
            bc.acquired_at,
            bc.created_at,
            bc.updated_at,

            b.isbn,
            b.title

        FROM book_copies bc

        INNER JOIN books b
            ON b.id = bc.book_id

        WHERE bc.id = $1

        LIMIT 1
        `,
        [copyId]
    );

    return result.rows[0] || null;
};

const findBookCopyByBarcode = async (barcode) => {
    const result = await pool.query(
        `
        SELECT
            bc.id,
            bc.book_id,
            bc.accession_number,
            bc.barcode,
            bc.shelf_location,
            bc.condition,
            bc.status,
            bc.acquired_at,

            b.isbn,
            b.title

        FROM book_copies bc

        INNER JOIN books b
            ON b.id = bc.book_id

        WHERE bc.barcode = $1

        LIMIT 1
        `,
        [barcode]
    );

    return result.rows[0] || null;
};

module.exports = {
    getBookById,
    findCopyByAccessionNumber,
    findCopyByBarcode,
    createBookCopy,
    getAllBookCopies,
    getCopiesByBookId,
    getBookCopyById,
    findBookCopyByBarcode,
};
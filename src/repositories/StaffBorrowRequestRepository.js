const pool = require("../config/database");

const getPendingBorrowRequests = async () => {
    const result = await pool.query(
        `
        SELECT
            br.id,
            br.borrower_id,
            br.book_id,
            br.status,
            br.created_at,

            u.school_id,
            u.first_name,
            u.middle_name,
            u.last_name,
            u.borrower_type,
            u.account_status,

            b.isbn,
            b.title,
            b.cover_image_url,

            COUNT(bc.id)
                FILTER (
                    WHERE bc.status = 'available'
                ) AS available_copies

        FROM borrow_requests br

        INNER JOIN users u
            ON u.id = br.borrower_id

        INNER JOIN books b
            ON b.id = br.book_id

        LEFT JOIN book_copies bc
            ON bc.book_id = b.id

        WHERE br.status = 'pending'

        GROUP BY
            br.id,
            u.id,
            b.id

        ORDER BY br.created_at ASC
        `
    );

    return result.rows;
};

const getBorrowRequestById = async (requestId) => {
    const result = await pool.query(
        `
        SELECT
            br.id,
            br.borrower_id,
            br.book_id,
            br.status,
            br.rejection_reason,
            br.reviewed_by,
            br.reviewed_at,
            br.created_at,

            u.school_id,
            u.borrower_type,
            u.account_status,

            b.title

        FROM borrow_requests br

        INNER JOIN users u
            ON u.id = br.borrower_id

        INNER JOIN books b
            ON b.id = br.book_id

        WHERE br.id = $1

        LIMIT 1
        `,
        [requestId]
    );

    return result.rows[0] || null;
};

const getBookCopyByBarcode = async (barcode) => {
    const result = await pool.query(
        `
        SELECT
            id,
            book_id,
            accession_number,
            barcode,
            condition,
            status
        FROM book_copies
        WHERE barcode = $1
        LIMIT 1
        `,
        [barcode]
    );

    return result.rows[0] || null;
};

const getBorrowingPeriodDays = async () => {
    const result = await pool.query(
        `
        SELECT setting_value
        FROM library_settings
        WHERE setting_key = 'borrowing_period_days'
        LIMIT 1
        `
    );

    return result.rows[0] || null;
};

const approveBorrowRequest = async ({
    requestId,
    borrowerId,
    bookCopyId,
    staffId,
    dueAt,
}) => {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        // Serialize competing approvals/rejections on the request row.
        const locked = await client.query(
            "SELECT id FROM borrow_requests WHERE id = $1 AND status = 'pending' FOR UPDATE",
            [requestId]
        );
        if (!locked.rowCount) {
            const err = new Error("Borrow request is no longer pending.");
            err.statusCode = 409;
            throw err;
        }
        // Claim an available copy atomically while holding its row lock.
        const claimed = await client.query(`
            UPDATE book_copies SET status = 'borrowed'
            WHERE id = $1 AND status = 'available'
              AND condition NOT IN ('damaged', 'lost')
            RETURNING id
        `, [bookCopyId]);
        if (!claimed.rowCount) {
            const err = new Error("Book copy is no longer available.");
            err.statusCode = 409;
            throw err;
        }
        const transactionResult = await client.query(`
            INSERT INTO borrow_transactions (
                borrow_request_id, borrower_id, book_copy_id, processed_by, due_at
            ) VALUES ($1, $2, $3, $4, $5) RETURNING *
        `, [requestId, borrowerId, bookCopyId, staffId, dueAt]);
        await client.query(`
            UPDATE borrow_requests SET status = 'approved', reviewed_by = $1,
                reviewed_at = NOW() WHERE id = $2
        `, [staffId, requestId]);
        await client.query("COMMIT");

        return transactionResult.rows[0];
    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
};

const rejectBorrowRequest = async ({
    requestId,
    staffId,
    rejectionReason,
}) => {
    const result = await pool.query(
        `
        UPDATE borrow_requests
        SET
            status = 'rejected',
            rejection_reason = $1,
            reviewed_by = $2,
            reviewed_at = NOW()
        WHERE id = $3 AND status = 'pending'
        RETURNING *
        `,
        [
            rejectionReason,
            staffId,
            requestId,
        ]
    );

    return result.rows[0] || null;
};

module.exports = {
    getPendingBorrowRequests,
    getBorrowRequestById,
    getBookCopyByBarcode,
    getBorrowingPeriodDays,
    approveBorrowRequest,
    rejectBorrowRequest,
};
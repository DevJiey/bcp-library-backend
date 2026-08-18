const pool = require("../config/database");

const findActiveBorrowingByBarcode = async (barcode) => {
    const result = await pool.query(
        `
        SELECT
            bt.id AS borrow_transaction_id,
            bt.borrower_id,
            bt.book_copy_id,
            bt.borrowed_at,
            bt.due_at,
            bt.status,

            bc.barcode,
            bc.accession_number,
            bc.condition AS current_condition,

            b.id AS book_id,
            b.title

        FROM borrow_transactions bt

        INNER JOIN book_copies bc
            ON bc.id = bt.book_copy_id

        INNER JOIN books b
            ON b.id = bc.book_id

        WHERE bc.barcode = $1
          AND bt.status IN ('borrowed', 'overdue')

        LIMIT 1
        `,
        [barcode]
    );

    return result.rows[0] || null;
};

const processReturnTransaction = async ({
    borrowTransactionId,
    bookCopyId,
    staffId,
    conditionOnReturn,
    remarks,
}) => {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        const returnResult = await client.query(
            `
            INSERT INTO return_records (
                borrow_transaction_id,
                processed_by,
                condition_on_return,
                remarks
            )
            VALUES ($1, $2, $3, $4)
            RETURNING *
            `,
            [
                borrowTransactionId,
                staffId,
                conditionOnReturn,
                remarks || null,
            ]
        );

        await client.query(
            `
            UPDATE borrow_transactions
            SET
                status = 'returned',
                returned_at = NOW()
            WHERE id = $1
            `,
            [borrowTransactionId]
        );

        let copyStatus = "available";

        if (conditionOnReturn === "damaged") {
            copyStatus = "damaged";
        }

        if (conditionOnReturn === "lost") {
            copyStatus = "lost";
        }

        await client.query(
            `
            UPDATE book_copies
            SET
                condition = $1,
                status = $2
            WHERE id = $3
            `,
            [
                conditionOnReturn,
                copyStatus,
                bookCopyId,
            ]
        );

        await client.query("COMMIT");

        return returnResult.rows[0];
    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
};

module.exports = {
    findActiveBorrowingByBarcode,
    processReturnTransaction,
};
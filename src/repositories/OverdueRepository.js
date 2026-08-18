const pool = require("../config/database");

const getOverdueBorrowings = async () => {
    const result = await pool.query(
        `
        SELECT
            bt.id,
            bt.borrower_id,
            bt.book_copy_id,
            bt.due_at,
            bt.status,

            u.school_id,
            u.account_status,

            b.title

        FROM borrow_transactions bt

        INNER JOIN users u
            ON u.id = bt.borrower_id

        INNER JOIN book_copies bc
            ON bc.id = bt.book_copy_id

        INNER JOIN books b
            ON b.id = bc.book_id

        WHERE bt.status = 'borrowed'
          AND bt.due_at < NOW()

        ORDER BY bt.due_at ASC
        `
    );

    return result.rows;
};

const markBorrowingOverdue = async (transactionId) => {
    const result = await pool.query(
        `
        UPDATE borrow_transactions
        SET status = 'overdue'
        WHERE id = $1
          AND status = 'borrowed'
        RETURNING *
        `,
        [transactionId]
    );

    return result.rows[0] || null;
};

const lockBorrowerAccount = async (borrowerId) => {
    const result = await pool.query(
        `
        UPDATE users
        SET account_status = 'locked'
        WHERE id = $1
          AND role = 'borrower'
          AND account_status = 'active'
        RETURNING *
        `,
        [borrowerId]
    );

    return result.rows[0] || null;
};

const countOverdueBorrowings = async (borrowerId) => {
    const result = await pool.query(
        `
        SELECT COUNT(*)::int AS count
        FROM borrow_transactions
        WHERE borrower_id = $1
          AND status = 'overdue'
        `,
        [borrowerId]
    );

    return result.rows[0].count;
};

const unlockBorrowerAccount = async (borrowerId) => {
    const result = await pool.query(
        `
        UPDATE users
        SET account_status = 'active'
        WHERE id = $1
          AND role = 'borrower'
          AND account_status = 'locked'
        RETURNING *
        `,
        [borrowerId]
    );

    return result.rows[0] || null;
};

const createNotification = async ({
    userId,
    type,
    title,
    message,
    relatedEntityType,
    relatedEntityId,
}) => {
    const result = await pool.query(
        `
        INSERT INTO notifications (
            user_id,
            type,
            title,
            message,
            related_entity_type,
            related_entity_id
        )
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
        `,
        [
            userId,
            type,
            title,
            message,
            relatedEntityType || null,
            relatedEntityId || null,
        ]
    );

    return result.rows[0];
};

module.exports = {
    getOverdueBorrowings,
    markBorrowingOverdue,
    lockBorrowerAccount,
    countOverdueBorrowings,
    unlockBorrowerAccount,
    createNotification,
};
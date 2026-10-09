
const pool = require("../config/database");

/**
 * Create a pending borrower and invitation
 * in a single database transaction.
 */
async function createPendingBorrower({
    schoolId,
    email,
    passwordHash,
    firstName,
    middleName,
    lastName,
    borrowerType,
    program,
    yearLevel,
    section,
    departmentId,
    position,
    employmentStatus,
    tokenHash,
    expiresAt,
}) {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        const userResult = await client.query(
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
                $6, 'borrower', $7, 'pending', TRUE
            )
            RETURNING
                id,
                school_id,
                email,
                first_name,
                middle_name,
                last_name,
                borrower_type,
                account_status
            `,
            [
                schoolId,
                email,
                passwordHash,
                firstName,
                middleName || null,
                lastName,
                borrowerType,
            ]
        );

        const user = userResult.rows[0];

        if (borrowerType === "student") {
            await client.query(
                `
                INSERT INTO student_profiles (
                    user_id,
                    program,
                    year_level,
                    section
                )
                VALUES ($1, $2, $3, $4)
                `,
                [
                    user.id,
                    program,
                    yearLevel,
                    section || null,
                ]
            );
        } else if (borrowerType === "faculty") {
            await client.query(
                `
                INSERT INTO faculty_profiles (
                    user_id,
                    department_id,
                    position,
                    employment_status
                )
                VALUES ($1, $2, $3, $4)
                `,
                [
                    user.id,
                    departmentId,
                    position || null,
                    employmentStatus,
                ]
            );
        } else {
            throw new Error(
                "Invalid borrower type."
            );
        }

        await client.query(
            `
            INSERT INTO borrower_invitations (
                user_id,
                token_hash,
                expires_at
            )
            VALUES ($1, $2, $3)
            `,
            [user.id, tokenHash, expiresAt]
        );

        await client.query("COMMIT");

        return user;
    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
}

/**
 * Find an invitation that is still valid.
 * This is a read-only check.
 */
async function findValidInvitation(tokenHash) {
    const result = await pool.query(
        `
        SELECT
            bi.id AS invitation_id,
            bi.user_id,
            bi.expires_at,
            u.school_id,
            u.email,
            u.first_name,
            u.borrower_type
        FROM borrower_invitations bi
        JOIN users u ON u.id = bi.user_id
        WHERE bi.token_hash = $1
          AND bi.used_at IS NULL
          AND bi.revoked_at IS NULL
          AND bi.expires_at > NOW()
          AND u.role = 'borrower'
          AND u.account_status = 'pending'
        LIMIT 1
        `,
        [tokenHash]
    );

    return result.rows[0] || null;
}

/**
 * Activate a pending borrower and consume
 * the invitation in one transaction.
 *
 * Lock order: users first, then invitations.
 * This matches the resend flow.
 */
async function completeInvitation({
    tokenHash,
    passwordHash,
}) {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        // Find the associated user without locking.
        const lookupResult = await client.query(
            `
            SELECT user_id
            FROM borrower_invitations
            WHERE token_hash = $1
            `,
            [tokenHash]
        );

        if (lookupResult.rows.length === 0) {
            await client.query("ROLLBACK");
            return null;
        }

        const userId = lookupResult.rows[0].user_id;

        // Lock user first to match replaceInvitation.
        const userResult = await client.query(
            `
            SELECT id
            FROM users
            WHERE id = $1
              AND role = 'borrower'
              AND account_status = 'pending'
            FOR UPDATE
            `,
            [userId]
        );

        if (userResult.rows.length === 0) {
            await client.query("ROLLBACK");
            return null;
        }

        // Revalidate and lock the invitation.
        const invitationResult = await client.query(
            `
            SELECT id
            FROM borrower_invitations
            WHERE token_hash = $1
              AND user_id = $2
              AND used_at IS NULL
              AND revoked_at IS NULL
              AND expires_at > NOW()
            FOR UPDATE
            `,
            [tokenHash, userId]
        );

        if (invitationResult.rows.length === 0) {
            await client.query("ROLLBACK");
            return null;
        }

        const invitationId = invitationResult.rows[0].id;

        // Activate borrower and save their password.
        const updateResult = await client.query(
            `
            UPDATE users
            SET password_hash = $1,
                account_status = 'active',
                is_first_login = FALSE,
                updated_at = NOW()
            WHERE id = $2
              AND role = 'borrower'
              AND account_status = 'pending'
            `,
            [passwordHash, userId]
        );

        if (updateResult.rowCount !== 1) {
            throw new Error(
                "Borrower activation failed."
            );
        }

        // Consume the invitation exactly once.
        const consumeResult = await client.query(
            `
            UPDATE borrower_invitations
            SET used_at = NOW()
            WHERE id = $1
              AND used_at IS NULL
              AND revoked_at IS NULL
              AND expires_at > NOW()
            `,
            [invitationId]
        );

        if (consumeResult.rowCount !== 1) {
            throw new Error(
                "Invitation consumption failed."
            );
        }

        await client.query("COMMIT");

        return { userId };
    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
}

/**
 * Replace an unused invitation for a pending borrower.
 * Previous links are revoked, including expired links.
 */
async function replaceInvitation({
    userId,
    tokenHash,
    expiresAt,
}) {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        const userResult = await client.query(
            `
            SELECT
                id,
                email,
                first_name,
                school_id
            FROM users
            WHERE id = $1
              AND role = 'borrower'
              AND account_status = 'pending'
            FOR UPDATE
            `,
            [userId]
        );

        if (userResult.rows.length === 0) {
            await client.query("ROLLBACK");
            return null;
        }

        // Revoke all previous unused invitations.
        await client.query(
            `
            UPDATE borrower_invitations
            SET revoked_at = NOW()
            WHERE user_id = $1
              AND used_at IS NULL
              AND revoked_at IS NULL
            `,
            [userId]
        );

        // Create a fresh invitation.
        await client.query(
            `
            INSERT INTO borrower_invitations (
                user_id,
                token_hash,
                expires_at
            )
            VALUES ($1, $2, $3)
            `,
            [userId, tokenHash, expiresAt]
        );

        await client.query("COMMIT");

        return userResult.rows[0];
    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
}

module.exports = {
    createPendingBorrower,
    findValidInvitation,
    completeInvitation,
    replaceInvitation,
};


const crypto = require("node:crypto");

const INVITATION_EXPIRY_HOURS = 24;

/**
 * Generate a cryptographically secure invitation token.
 *
 * The raw token is sent to the borrower's email.
 * Only its SHA-256 hash should be stored in the database.
 */
function generateInvitationToken() {
    const token = crypto.randomBytes(32).toString("hex");

    return {
        token,
        tokenHash: hashInvitationToken(token),
        expiresAt: new Date(
            Date.now() +
                INVITATION_EXPIRY_HOURS * 60 * 60 * 1000
        ),
    };
}

/**
 * Hash an invitation token for database storage or lookup.
 */
function hashInvitationToken(token) {
    if (
        typeof token !== "string" ||
        !/^[a-f0-9]{64}$/i.test(token)
    ) {
        throw new Error("Invalid invitation token format.");
    }

    return crypto
        .createHash("sha256")
        .update(token.toLowerCase(), "utf8")
        .digest("hex");
}

module.exports = {
    INVITATION_EXPIRY_HOURS,
    generateInvitationToken,
    hashInvitationToken,
};

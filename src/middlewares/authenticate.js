const jwt = require("jsonwebtoken");

const {
    findUserById,
} = require("../repositories/AuthRepository");

const authenticate = async (
    req,
    res,
    next
) => {
    try {
        const authorizationHeader =
            req.headers.authorization;

        if (
            !authorizationHeader ||
            !authorizationHeader.startsWith(
                "Bearer "
            )
        ) {
            return res.status(401).json({
                success: false,
                message:
                    "Authentication required.",
            });
        }

        const token =
            authorizationHeader.split(" ")[1];

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        /*
         * Re-check the user from the database.
         *
         * A valid JWT alone is not enough because
         * the user's account status or role may
         * have changed after the token was issued.
         */
        const user = await findUserById(
            decoded.userId
        );

        if (!user) {
            return res.status(401).json({
                success: false,
                message:
                    "User account no longer exists.",
            });
        }

        if (user.account_status === "pending") {
            return res.status(403).json({
                success: false,
                message:
                    "Please complete your account setup before signing in.",
            });
        }

        if (
            user.account_status === "inactive"
        ) {
            return res.status(403).json({
                success: false,
                message:
                    "Your account is inactive.",
            });
        }

        if (
            user.account_status === "suspended"
        ) {
            return res.status(403).json({
                success: false,
                message:
                    "Your account is suspended.",
            });
        }

        req.user = {
            id: user.id,
            schoolId: user.school_id,
            role: user.role,
            borrowerType:
                user.borrower_type,
            accountStatus:
                user.account_status,
        };

        next();
    } catch (error) {
        if (
            error.name ===
            "TokenExpiredError"
        ) {
            return res.status(401).json({
                success: false,
                message:
                    "Authentication token has expired.",
            });
        }

        return res.status(401).json({
            success: false,
            message:
                "Invalid authentication token.",
        });
    }
};

module.exports = authenticate;
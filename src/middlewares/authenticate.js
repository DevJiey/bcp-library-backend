const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
    try {
        const authorizationHeader = req.headers.authorization;

        if (
            !authorizationHeader ||
            !authorizationHeader.startsWith("Bearer ")
        ) {
            return res.status(401).json({
                success: false,
                message: "Authentication required.",
            });
        }

        const token = authorizationHeader.split(" ")[1];

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.user = {
            id: decoded.userId,
            schoolId: decoded.schoolId,
            role: decoded.role,
            borrowerType: decoded.borrowerType,
        };

        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                success: false,
                message: "Authentication token has expired.",
            });
        }

        return res.status(401).json({
            success: false,
            message: "Invalid authentication token.",
        });
    }
};

module.exports = authenticate;
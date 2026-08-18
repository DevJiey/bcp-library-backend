const {
    login,
    getCurrentUser,
} = require("../services/AuthService");

const asyncHandler = require("../middlewares/asyncHandler");

const loginUser = asyncHandler(
    async (req, res) => {
        const result = await login(req.body);

        return res.status(200).json({
            success: true,
            message: "Login successful.",
            data: result,
        });
    }
);

const getMe = asyncHandler(
    async (req, res) => {
        const user = await getCurrentUser(
            req.user.id
        );

        return res.status(200).json({
            success: true,
            message:
                "Current user retrieved successfully.",
            data: user,
        });
    }
);

module.exports = {
    loginUser,
    getMe,
};
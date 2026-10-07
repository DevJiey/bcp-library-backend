const {
    login,
    getCurrentUser,
    changePassword,
} = require("../services/AuthService");

const asyncHandler = require("../middlewares/asyncHandler");

const loginUser = asyncHandler(
    async (req, res) => {
        const result = await login(
            req.body
        );

        return res.status(200).json({
            success: true,
            message:
                "Login successful.",
            data: result,
        });
    }
);

const getMe = asyncHandler(
    async (req, res) => {
        const user =
            await getCurrentUser(
                req.user.id
            );

        return res.status(200).json({
            success: true,
            message:
                "User retrieved successfully.",
            data: user,
        });
    }
);

const changeUserPassword = asyncHandler(
    async (req, res) => {
        const result =
            await changePassword({
                userId: req.user.id,
                currentPassword:
                    req.body.currentPassword,
                newPassword:
                    req.body.newPassword,
            });

        return res.status(200).json({
            success: true,
            message:
                "Password changed successfully.",
            data: result,
        });
    }
);

module.exports = {
    loginUser,
    getMe,
    changeUserPassword,
};
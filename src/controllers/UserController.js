const {
    createAccount,
    listUsers,
    getUserDetails,
    getMyProfile,
    updateMyProfile,
    updateBorrowerByAdmin,
    changeUserStatus,
} = require("../services/UserService");

const asyncHandler = require("../middlewares/asyncHandler");

const {
    recordAuditLog,
} = require("../services/AuditLogService");

const {
    getRequestMetadata,
} = require("../utils/requestMetadata");

const createUserAccount = asyncHandler(
    async (req, res) => {
        const result = await createAccount(
            req.body
        );

        return res.status(201).json({
            success: true,
            message:
                "User account created successfully.",
            data: result,
        });
    }
);

const getUsers = asyncHandler(
    async (req, res) => {
        const users = await listUsers(
            req.user
        );

        return res.status(200).json({
            success: true,
            message:
                "Users retrieved successfully.",
            data: users,
        });
    }
);

const getUser = asyncHandler(
    async (req, res) => {
        const user = await getUserDetails({
            requestingUser: req.user,
            userId: req.params.id,
        });

        return res.status(200).json({
            success: true,
            message:
                "User retrieved successfully.",
            data: user,
        });
    }
);

const getCurrentUserProfile = asyncHandler(
    async (req, res) => {
        const profile = await getMyProfile(
            req.user.id
        );

        return res.status(200).json({
            success: true,
            message:
                "Profile retrieved successfully.",
            data: profile,
        });
    }
);

const updateCurrentUserProfile =
    asyncHandler(
        async (req, res) => {
            const profile =
                await updateMyProfile({
                    userId: req.user.id,
                    ...req.body,
                });

            const {
                ipAddress,
                userAgent,
            } = getRequestMetadata(req);

            await recordAuditLog({
                userId: req.user.id,
                action: "UPDATE_PROFILE",
                module: "Users",
                entityType: "user",
                entityId: req.user.id,
                description:
                    "Updated own borrower profile information.",
                ipAddress,
                userAgent,
            });

            return res.status(200).json({
                success: true,
                message:
                    "Profile updated successfully.",
                data: profile,
            });
        }
    );

const updateBorrowerAccount =
    asyncHandler(
        async (req, res) => {
            const profile =
                await updateBorrowerByAdmin({
                    requestingUser:
                        req.user,
                    userId:
                        req.params.id,
                    ...req.body,
                });

            const {
                ipAddress,
                userAgent,
            } = getRequestMetadata(req);

            await recordAuditLog({
                userId: req.user.id,
                action:
                    "UPDATE_BORROWER",
                module: "Users",
                entityType: "user",
                entityId:
                    req.params.id,
                description:
                    "Updated borrower account information.",
                ipAddress,
                userAgent,
            });

            return res
                .status(200)
                .json({
                    success: true,
                    message:
                        "Borrower information updated successfully.",
                    data: profile,
                });
        }
    );

const updateUserAccountStatus =
    asyncHandler(
        async (req, res) => {
            const user =
                await changeUserStatus({
                    requestingUser:
                        req.user,
                    userId:
                        req.params.id,
                    accountStatus:
                        req.body
                            .accountStatus,
                });

            return res
                .status(200)
                .json({
                    success: true,
                    message:
                        "User account status updated successfully.",
                    data: user,
                });
        }
    );

module.exports = {
    createUserAccount,
    getUsers,
    getUser,
    getCurrentUserProfile,
    updateCurrentUserProfile,
    updateBorrowerAccount,
    updateUserAccountStatus,
};
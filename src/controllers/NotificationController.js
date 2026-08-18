const {
    listMyNotifications,
    getMyUnreadCount,
    readNotification,
    readAllNotifications,
} = require("../services/NotificationService");

const asyncHandler = require("../middlewares/asyncHandler");

const getMyNotifications = asyncHandler(
    async (req, res) => {
        const notifications =
            await listMyNotifications(
                req.user.id
            );

        return res.status(200).json({
            success: true,
            message:
                "Notifications retrieved successfully.",
            data: notifications,
        });
    }
);

const getUnreadCount = asyncHandler(
    async (req, res) => {
        const result =
            await getMyUnreadCount(
                req.user.id
            );

        return res.status(200).json({
            success: true,
            message:
                "Unread notification count retrieved successfully.",
            data: result,
        });
    }
);

const markNotificationRead = asyncHandler(
    async (req, res) => {
        const notification =
            await readNotification({
                notificationId: req.params.id,
                userId: req.user.id,
            });

        return res.status(200).json({
            success: true,
            message:
                "Notification marked as read.",
            data: notification,
        });
    }
);

const markAllNotificationsRead = asyncHandler(
    async (req, res) => {
        const result =
            await readAllNotifications(
                req.user.id
            );

        return res.status(200).json({
            success: true,
            message:
                "All notifications marked as read.",
            data: result,
        });
    }
);

module.exports = {
    getMyNotifications,
    getUnreadCount,
    markNotificationRead,
    markAllNotificationsRead,
};
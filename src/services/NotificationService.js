const {
    getNotificationsByUser,
    getUnreadNotificationCount,
    getNotificationById,
    markNotificationAsRead,
    markAllNotificationsAsRead,
} = require("../repositories/NotificationRepository");

const AppError = require("../utils/AppError");

const listMyNotifications = async (
    userId
) => {
    return await getNotificationsByUser(
        userId
    );
};

const getMyUnreadCount = async (
    userId
) => {
    const count =
        await getUnreadNotificationCount(
            userId
        );

    return {
        unreadCount: count,
    };
};

const readNotification = async ({
    notificationId,
    userId,
}) => {
    const notification =
        await getNotificationById({
            notificationId,
            userId,
        });

    if (!notification) {
        throw new AppError(
            "Notification not found.",
            404
        );
    }

    if (notification.is_read) {
        return notification;
    }

    return await markNotificationAsRead({
        notificationId,
        userId,
    });
};

const readAllNotifications = async (
    userId
) => {
    const updatedNotifications =
        await markAllNotificationsAsRead(
            userId
        );

    return {
        updatedCount:
            updatedNotifications.length,
    };
};

module.exports = {
    listMyNotifications,
    getMyUnreadCount,
    readNotification,
    readAllNotifications,
};
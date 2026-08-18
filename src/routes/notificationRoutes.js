const express = require("express");

const {
    getMyNotifications,
    getUnreadCount,
    markNotificationRead,
    markAllNotificationsRead,
} = require("../controllers/NotificationController");

const authenticate = require("../middlewares/authenticate");

const router = express.Router();

/**
 * @swagger
 * /notifications/me:
 *   get:
 *     summary: Get my notifications
 *     description: Returns all notifications of the currently authenticated user.
 *     tags:
 *       - Notifications
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Notifications retrieved successfully.
 *       401:
 *         description: Authentication required.
 *       500:
 *         description: Internal server error.
 */
router.get(
    "/notifications/me",
    authenticate,
    getMyNotifications
);

/**
 * @swagger
 * /notifications/me/unread-count:
 *   get:
 *     summary: Get unread notification count
 *     description: Returns the number of unread notifications of the authenticated user.
 *     tags:
 *       - Notifications
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Unread notification count retrieved successfully.
 *       401:
 *         description: Authentication required.
 *       500:
 *         description: Internal server error.
 */
router.get(
    "/notifications/me/unread-count",
    authenticate,
    getUnreadCount
);

/**
 * @swagger
 * /notifications/read-all:
 *   patch:
 *     summary: Mark all notifications as read
 *     description: Marks all unread notifications of the authenticated user as read.
 *     tags:
 *       - Notifications
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All notifications marked as read.
 *       401:
 *         description: Authentication required.
 *       500:
 *         description: Internal server error.
 */
router.patch(
    "/notifications/read-all",
    authenticate,
    markAllNotificationsRead
);

/**
 * @swagger
 * /notifications/{id}/read:
 *   patch:
 *     summary: Mark notification as read
 *     description: Marks one notification belonging to the authenticated user as read.
 *     tags:
 *       - Notifications
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Notification ID
 *     responses:
 *       200:
 *         description: Notification marked as read.
 *       401:
 *         description: Authentication required.
 *       404:
 *         description: Notification not found.
 *       500:
 *         description: Internal server error.
 */
router.patch(
    "/notifications/:id/read",
    authenticate,
    markNotificationRead
);

module.exports = router;
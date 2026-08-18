const express = require("express");

const {
    getAuditLogs,
} = require("../controllers/AuditLogController");

const authenticate = require("../middlewares/authenticate");
const authorize = require("../middlewares/authorize");

const router = express.Router();

/**
 * @swagger
 * /audit-logs:
 *   get:
 *     summary: Get audit logs
 *     description: Returns paginated audit logs with optional filters. Admin access only.
 *     tags:
 *       - Audit Logs
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: false
 *         schema:
 *           type: integer
 *         description: Filter by user ID
 *       - in: query
 *         name: action
 *         required: false
 *         schema:
 *           type: string
 *         example: "APPROVE_BORROW_REQUEST"
 *       - in: query
 *         name: module
 *         required: false
 *         schema:
 *           type: string
 *         example: "Borrowing"
 *       - in: query
 *         name: entityType
 *         required: false
 *         schema:
 *           type: string
 *         example: "borrow_request"
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *         example: 1
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           default: 20
 *           maximum: 100
 *         example: 20
 *     responses:
 *       200:
 *         description: Audit logs retrieved successfully.
 *       400:
 *         description: Invalid pagination values.
 *       401:
 *         description: Authentication required.
 *       403:
 *         description: Admin access required.
 *       500:
 *         description: Internal server error.
 */
router.get(
    "/audit-logs",
    authenticate,
    authorize("admin"),
    getAuditLogs
);

module.exports = router;
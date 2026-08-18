const express = require("express");

const {
    getPendingRequests,
    approveBorrowRequest,
    rejectBorrowRequest,
} = require("../controllers/StaffBorrowRequestController");

const authenticate = require("../middlewares/authenticate");
const authorize = require("../middlewares/authorize");
const validateRequest = require("../middlewares/validateRequest");

const {
    approveBorrowRequestSchema,
    rejectBorrowRequestSchema,
} = require("../validators/staffBorrowRequestValidator");

const router = express.Router();

/**
 * @swagger
 * /staff/borrow-requests:
 *   get:
 *     summary: Get pending borrow requests
 *     description: Returns all pending borrow requests for Staff and Admin.
 *     tags:
 *       - Staff Borrow Requests
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Pending borrow requests retrieved successfully.
 *       401:
 *         description: Authentication required.
 *       403:
 *         description: Staff or Admin access required.
 *       500:
 *         description: Internal server error.
 */
router.get(
    "/staff/borrow-requests",
    authenticate,
    authorize("staff", "admin"),
    getPendingRequests
);

/**
 * @swagger
 * /staff/borrow-requests/{id}/approve:
 *   patch:
 *     summary: Approve borrow request
 *     description: Approves a pending borrow request after Staff scans or enters the barcode of an available physical book copy.
 *     tags:
 *       - Staff Borrow Requests
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Borrow request ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - barcode
 *             properties:
 *               barcode:
 *                 type: string
 *                 example: "BCP-BOOK-0001"
 *     responses:
 *       200:
 *         description: Borrow request approved successfully.
 *       400:
 *         description: Invalid book copy or scanned copy does not match requested book.
 *       401:
 *         description: Authentication required.
 *       403:
 *         description: Staff or Admin access required, or borrower account is restricted.
 *       404:
 *         description: Borrow request or book copy not found.
 *       409:
 *         description: Request is no longer pending or book copy is unavailable.
 *       500:
 *         description: Internal server error.
 */
router.patch(
    "/staff/borrow-requests/:id/approve",
    authenticate,
    authorize("staff", "admin"),
    validateRequest(approveBorrowRequestSchema),
    approveBorrowRequest
);

/**
 * @swagger
 * /staff/borrow-requests/{id}/reject:
 *   patch:
 *     summary: Reject borrow request
 *     description: Rejects a pending borrow request. Rejection reason is required.
 *     tags:
 *       - Staff Borrow Requests
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Borrow request ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - rejectionReason
 *             properties:
 *               rejectionReason:
 *                 type: string
 *                 example: "Book copy is currently unavailable."
 *     responses:
 *       200:
 *         description: Borrow request rejected successfully.
 *       400:
 *         description: Validation failed.
 *       401:
 *         description: Authentication required.
 *       403:
 *         description: Staff or Admin access required.
 *       404:
 *         description: Borrow request not found.
 *       409:
 *         description: Request is no longer pending.
 *       500:
 *         description: Internal server error.
 */
router.patch(
    "/staff/borrow-requests/:id/reject",
    authenticate,
    authorize("staff", "admin"),
    validateRequest(rejectBorrowRequestSchema),
    rejectBorrowRequest
);

module.exports = router;
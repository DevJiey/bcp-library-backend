const express = require("express");

const {
    createBorrowRequest,
    getMyBorrowRequests,
} = require("../controllers/BorrowRequestController");

const authenticate = require("../middlewares/authenticate");
const authorize = require("../middlewares/authorize");
const validateRequest = require("../middlewares/validateRequest");

const {
    createBorrowRequestSchema,
} = require("../validators/borrowRequestValidator");

const router = express.Router();

/**
 * @swagger
 * /borrow-requests:
 *   post:
 *     summary: Submit a borrow request
 *     description: Allows an authenticated borrower to request an available book.
 *     tags:
 *       - Borrow Requests
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - bookId
 *             properties:
 *               bookId:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Borrow request submitted successfully.
 *       400:
 *         description: Validation failed or borrower/book state is invalid.
 *       401:
 *         description: Authentication required.
 *       403:
 *         description: Borrower access required or account is restricted.
 *       404:
 *         description: Borrower or book not found.
 *       409:
 *         description: No available copy, duplicate request, or borrowing limit reached.
 *       500:
 *         description: Internal server error.
 */
router.post(
    "/borrow-requests",
    authenticate,
    authorize("borrower"),
    validateRequest(createBorrowRequestSchema),
    createBorrowRequest
);

/**
 * @swagger
 * /borrow-requests/me:
 *   get:
 *     summary: Get my borrow requests
 *     description: Returns the authenticated borrower's borrow request history.
 *     tags:
 *       - Borrow Requests
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Borrow requests retrieved successfully.
 *       401:
 *         description: Authentication required.
 *       403:
 *         description: Borrower access required.
 *       404:
 *         description: Borrower account not found.
 *       500:
 *         description: Internal server error.
 */
router.get(
    "/borrow-requests/me",
    authenticate,
    authorize("borrower"),
    getMyBorrowRequests
);

module.exports = router;
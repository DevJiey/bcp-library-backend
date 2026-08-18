const express = require("express");

const {
    getMyBorrowings,
    getMyActiveBorrowings,
} = require("../controllers/BorrowTransactionController");

const authenticate = require("../middlewares/authenticate");
const authorize = require("../middlewares/authorize");

const router = express.Router();

/**
 * @swagger
 * /borrowings/me:
 *   get:
 *     summary: Get my borrowing history
 *     description: Returns all borrowing transactions of the authenticated borrower.
 *     tags:
 *       - Borrowings
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Borrowing history retrieved successfully.
 *       401:
 *         description: Authentication required.
 *       403:
 *         description: Borrower access required.
 *       500:
 *         description: Internal server error.
 */
router.get(
    "/borrowings/me",
    authenticate,
    authorize("borrower"),
    getMyBorrowings
);

/**
 * @swagger
 * /borrowings/me/active:
 *   get:
 *     summary: Get my active borrowings
 *     description: Returns currently borrowed or overdue books of the authenticated borrower.
 *     tags:
 *       - Borrowings
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Active borrowings retrieved successfully.
 *       401:
 *         description: Authentication required.
 *       403:
 *         description: Borrower access required.
 *       500:
 *         description: Internal server error.
 */
router.get(
    "/borrowings/me/active",
    authenticate,
    authorize("borrower"),
    getMyActiveBorrowings
);

module.exports = router;
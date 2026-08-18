const express = require("express");

const {
    getLibraryOverview,
    getBorrowingSummary,
    getBorrowRequestSummary,
    getPopularBooks,
    getOverdueReport,
} = require("../controllers/ReportController");

const authenticate = require("../middlewares/authenticate");
const authorize = require("../middlewares/authorize");

const router = express.Router();

/**
 * @swagger
 * /reports/overview:
 *   get:
 *     summary: Get library overview report
 *     description: Returns overall statistics for books, copies, borrowers, borrowings, overdue transactions, returns, and pending requests.
 *     tags:
 *       - Reports
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Library overview report retrieved successfully.
 *       401:
 *         description: Authentication required.
 *       403:
 *         description: Admin access required.
 *       500:
 *         description: Internal server error.
 */
router.get(
    "/reports/overview",
    authenticate,
    authorize("admin"),
    getLibraryOverview
);

/**
 * @swagger
 * /reports/borrowings:
 *   get:
 *     summary: Get borrowing status summary
 *     description: Returns the total number of borrowing transactions grouped by status.
 *     tags:
 *       - Reports
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Borrowing summary report retrieved successfully.
 *       401:
 *         description: Authentication required.
 *       403:
 *         description: Admin access required.
 *       500:
 *         description: Internal server error.
 */
router.get(
    "/reports/borrowings",
    authenticate,
    authorize("admin"),
    getBorrowingSummary
);

/**
 * @swagger
 * /reports/borrow-requests:
 *   get:
 *     summary: Get borrow request status summary
 *     description: Returns the total number of borrow requests grouped by status.
 *     tags:
 *       - Reports
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Borrow request summary report retrieved successfully.
 *       401:
 *         description: Authentication required.
 *       403:
 *         description: Admin access required.
 *       500:
 *         description: Internal server error.
 */
router.get(
    "/reports/borrow-requests",
    authenticate,
    authorize("admin"),
    getBorrowRequestSummary
);

/**
 * @swagger
 * /reports/popular-books:
 *   get:
 *     summary: Get most borrowed books
 *     description: Returns the most frequently borrowed books.
 *     tags:
 *       - Reports
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           default: 10
 *           minimum: 1
 *           maximum: 100
 *         example: 10
 *     responses:
 *       200:
 *         description: Popular books report retrieved successfully.
 *       400:
 *         description: Invalid limit.
 *       401:
 *         description: Authentication required.
 *       403:
 *         description: Admin access required.
 *       500:
 *         description: Internal server error.
 */
router.get(
    "/reports/popular-books",
    authenticate,
    authorize("admin"),
    getPopularBooks
);

/**
 * @swagger
 * /reports/overdue:
 *   get:
 *     summary: Get current overdue report
 *     description: Returns all borrowing transactions currently marked as overdue.
 *     tags:
 *       - Reports
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Overdue report retrieved successfully.
 *       401:
 *         description: Authentication required.
 *       403:
 *         description: Admin access required.
 *       500:
 *         description: Internal server error.
 */
router.get(
    "/reports/overdue",
    authenticate,
    authorize("admin"),
    getOverdueReport
);

module.exports = router;
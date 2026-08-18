const express = require("express");

const {
    runOverdueCheck,
} = require("../controllers/OverdueController");

const authenticate = require("../middlewares/authenticate");
const authorize = require("../middlewares/authorize");

const router = express.Router();

/**
 * @swagger
 * /admin/overdue/check:
 *   post:
 *     summary: Run overdue borrowing check
 *     description: Manually checks borrowed books that have passed their due date, marks them overdue, locks affected borrower accounts, and creates warning notifications.
 *     tags:
 *       - Overdue
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Overdue check completed successfully.
 *       401:
 *         description: Authentication required.
 *       403:
 *         description: Admin access required.
 *       500:
 *         description: Internal server error.
 */
router.post(
    "/admin/overdue/check",
    authenticate,
    authorize("admin"),
    runOverdueCheck
);

module.exports = router;
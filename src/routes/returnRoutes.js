const express = require("express");

const {
    processBookReturn,
} = require("../controllers/ReturnController");

const authenticate = require("../middlewares/authenticate");
const authorize = require("../middlewares/authorize");
const validateRequest = require("../middlewares/validateRequest");

const {
    processReturnSchema,
} = require("../validators/returnValidator");

const router = express.Router();

/**
 * @swagger
 * /returns:
 *   post:
 *     summary: Process returned book
 *     description: Processes the return of an actively borrowed or overdue physical book copy. Staff or Admin access.
 *     tags:
 *       - Returns
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - barcode
 *               - conditionOnReturn
 *             properties:
 *               barcode:
 *                 type: string
 *                 example: "BCP-BOOK-0001"
 *               conditionOnReturn:
 *                 type: string
 *                 enum:
 *                   - excellent
 *                   - good
 *                   - fair
 *                   - poor
 *                   - damaged
 *                   - lost
 *                 example: "good"
 *               remarks:
 *                 type: string
 *                 nullable: true
 *                 example: "Book returned in good condition."
 *     responses:
 *       200:
 *         description: Book return processed successfully.
 *       400:
 *         description: Validation failed.
 *       401:
 *         description: Authentication required.
 *       403:
 *         description: Staff or Admin access required.
 *       404:
 *         description: No active borrowing found for the barcode.
 *       500:
 *         description: Internal server error.
 */
router.post(
    "/returns",
    authenticate,
    authorize("staff", "admin"),
    validateRequest(processReturnSchema),
    processBookReturn
);

module.exports = router;
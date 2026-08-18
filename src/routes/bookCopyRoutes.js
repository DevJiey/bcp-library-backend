const express = require("express");

const {
    createBookCopy,
    getBookCopies,
    getCopiesByBook,
    getBookCopy,
    getCopyByBarcode,
} = require("../controllers/BookCopyController");

const authenticate = require("../middlewares/authenticate");
const authorize = require("../middlewares/authorize");
const validateRequest = require("../middlewares/validateRequest");

const {
    createBookCopySchema,
} = require("../validators/bookCopyValidator");

const router = express.Router();

/**
 * @swagger
 * /book-copies:
 *   post:
 *     summary: Create a physical book copy
 *     description: Creates a physical copy of an existing book. Admin access only.
 *     tags:
 *       - Book Copies
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
 *               - accessionNumber
 *               - barcode
 *             properties:
 *               bookId:
 *                 type: integer
 *                 example: 1
 *               accessionNumber:
 *                 type: string
 *                 example: "ACC-0001"
 *               barcode:
 *                 type: string
 *                 example: "BCP-BOOK-0001"
 *               shelfLocation:
 *                 type: string
 *                 nullable: true
 *                 example: "Shelf A-01"
 *               condition:
 *                 type: string
 *                 enum:
 *                   - excellent
 *                   - good
 *                   - fair
 *                   - poor
 *                   - damaged
 *                   - lost
 *                 example: "good"
 *               acquiredAt:
 *                 type: string
 *                 format: date
 *                 nullable: true
 *                 example: "2026-08-17"
 *     responses:
 *       201:
 *         description: Book copy created successfully.
 *       400:
 *         description: Validation failed or book is inactive.
 *       401:
 *         description: Authentication required.
 *       403:
 *         description: Admin access required.
 *       404:
 *         description: Book not found.
 *       409:
 *         description: Accession number or barcode already exists.
 *       500:
 *         description: Internal server error.
 */
router.post(
    "/book-copies",
    authenticate,
    authorize("admin"),
    validateRequest(createBookCopySchema),
    createBookCopy
);

/**
 * @swagger
 * /book-copies:
 *   get:
 *     summary: Get all physical book copies
 *     tags:
 *       - Book Copies
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Book copies retrieved successfully.
 *       401:
 *         description: Authentication required.
 *       403:
 *         description: Access denied.
 */
router.get(
    "/book-copies",
    authenticate,
    authorize("admin", "staff"),
    getBookCopies
);

/**
 * @swagger
 * /books/{bookId}/copies:
 *   get:
 *     summary: Get physical copies of a book
 *     tags:
 *       - Book Copies
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Book ID
 *     responses:
 *       200:
 *         description: Book copies retrieved successfully.
 *       401:
 *         description: Authentication required.
 *       403:
 *         description: Access denied.
 *       404:
 *         description: Book not found.
 */
router.get(
    "/books/:bookId/copies",
    authenticate,
    authorize("admin", "staff"),
    getCopiesByBook
);

/**
 * @swagger
 * /book-copies/barcode/{barcode}:
 *   get:
 *     summary: Find physical book copy by barcode
 *     description: Used by Staff when scanning or entering a physical book barcode.
 *     tags:
 *       - Book Copies
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: barcode
 *         required: true
 *         schema:
 *           type: string
 *         example: "BCP-BOOK-0001"
 *     responses:
 *       200:
 *         description: Book copy retrieved successfully.
 *       401:
 *         description: Authentication required.
 *       403:
 *         description: Access denied.
 *       404:
 *         description: Book copy not found.
 */
router.get(
    "/book-copies/barcode/:barcode",
    authenticate,
    authorize("admin", "staff"),
    getCopyByBarcode
);

/**
 * @swagger
 * /book-copies/{id}:
 *   get:
 *     summary: Get physical book copy by ID
 *     tags:
 *       - Book Copies
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Book copy ID
 *     responses:
 *       200:
 *         description: Book copy retrieved successfully.
 *       401:
 *         description: Authentication required.
 *       403:
 *         description: Access denied.
 *       404:
 *         description: Book copy not found.
 */
router.get(
    "/book-copies/:id",
    authenticate,
    authorize("admin", "staff"),
    getBookCopy
);

module.exports = router;
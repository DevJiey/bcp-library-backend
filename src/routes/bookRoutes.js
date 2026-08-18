const express = require("express");

const {
    createBook,
    getBooks,
    getBook,
    searchBooks,
} = require("../controllers/BookController");

const authenticate = require("../middlewares/authenticate");
const authorize = require("../middlewares/authorize");
const validateRequest = require("../middlewares/validateRequest");

const {
    createBookSchema,
} = require("../validators/bookValidator");

const router = express.Router();

/**
 * @swagger
 * /books:
 *   post:
 *     summary: Create a new book
 *     description: Creates a book and connects it to its category, publisher, and authors. Admin access only.
 *     tags:
 *       - Books
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - authorIds
 *             properties:
 *               isbn:
 *                 type: string
 *                 nullable: true
 *                 example: "9780137502875"
 *               title:
 *                 type: string
 *                 example: "Computer Security: Principles and Practice"
 *               categoryId:
 *                 type: integer
 *                 nullable: true
 *                 example: 1
 *               publisherId:
 *                 type: integer
 *                 nullable: true
 *                 example: 1
 *               publicationYear:
 *                 type: integer
 *                 nullable: true
 *                 example: 2023
 *               edition:
 *                 type: string
 *                 nullable: true
 *                 example: "5th Edition"
 *               description:
 *                 type: string
 *                 nullable: true
 *                 example: "A book about computer and information security."
 *               coverImageUrl:
 *                 type: string
 *                 nullable: true
 *                 example: "https://example.com/book-cover.jpg"
 *               authorIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 example:
 *                   - 1
 *     responses:
 *       201:
 *         description: Book created successfully.
 *       400:
 *         description: Validation failed or selected resource is inactive.
 *       401:
 *         description: Authentication required.
 *       403:
 *         description: Admin access required.
 *       404:
 *         description: Category, publisher, or author not found.
 *       409:
 *         description: ISBN already exists.
 *       500:
 *         description: Internal server error.
 */
router.post(
    "/books",
    authenticate,
    authorize("admin"),
    validateRequest(createBookSchema),
    createBook
);

/**
 * @swagger
 * /books/search:
 *   get:
 *     summary: Search book catalog
 *     description: Searches active books by title, ISBN, author, or category and returns physical copy availability.
 *     tags:
 *       - Books
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         required: false
 *         schema:
 *           type: string
 *         example: "security"
 *       - in: query
 *         name: categoryId
 *         required: false
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Book catalog search completed successfully.
 *       400:
 *         description: Invalid category ID.
 *       401:
 *         description: Authentication required.
 *       403:
 *         description: Access denied.
 *       500:
 *         description: Internal server error.
 */
router.get(
    "/books/search",
    authenticate,
    authorize("admin", "staff", "borrower"),
    searchBooks
);

/**
 * @swagger
 * /books:
 *   get:
 *     summary: Get all books
 *     description: Returns the library book catalog.
 *     tags:
 *       - Books
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Books retrieved successfully.
 *       401:
 *         description: Authentication required.
 *       403:
 *         description: Access denied.
 *       500:
 *         description: Internal server error.
 */
router.get(
    "/books",
    authenticate,
    authorize("admin", "staff", "borrower"),
    getBooks
);

/**
 * @swagger
 * /books/{id}:
 *   get:
 *     summary: Get book by ID
 *     description: Returns the complete details of a book including its category, publisher, and authors.
 *     tags:
 *       - Books
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Book ID
 *     responses:
 *       200:
 *         description: Book retrieved successfully.
 *       401:
 *         description: Authentication required.
 *       403:
 *         description: Access denied.
 *       404:
 *         description: Book not found.
 *       500:
 *         description: Internal server error.
 */
router.get(
    "/books/:id",
    authenticate,
    authorize("admin", "staff", "borrower"),
    getBook
);

module.exports = router;
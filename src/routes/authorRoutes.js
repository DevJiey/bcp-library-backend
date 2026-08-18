const express = require("express");

const {
    createAuthor,
    getAuthors,
    getAuthor,
    updateAuthor,
} = require("../controllers/AuthorController");

const authenticate = require("../middlewares/authenticate");
const authorize = require("../middlewares/authorize");
const validateRequest = require("../middlewares/validateRequest");

const {
    createAuthorSchema,
    updateAuthorSchema,
} = require("../validators/authorValidator");

const router = express.Router();

/**
 * @swagger
 * /authors:
 *   post:
 *     summary: Create a new author
 *     description: Creates a new author. Admin access only.
 *     tags:
 *       - Authors
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: "Robert"
 *               middleName:
 *                 type: string
 *                 nullable: true
 *                 example: null
 *               lastName:
 *                 type: string
 *                 example: "Martin"
 *     responses:
 *       201:
 *         description: Author created successfully.
 *       400:
 *         description: Validation failed.
 *       401:
 *         description: Authentication required.
 *       403:
 *         description: Admin access required.
 *       409:
 *         description: Author already exists.
 *       500:
 *         description: Internal server error.
 */
router.post(
    "/authors",
    authenticate,
    authorize("admin"),
    validateRequest(createAuthorSchema),
    createAuthor
);

/**
 * @swagger
 * /authors:
 *   get:
 *     summary: Get all authors
 *     description: Returns all authors. Admin and Staff access.
 *     tags:
 *       - Authors
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Authors retrieved successfully.
 *       401:
 *         description: Authentication required.
 *       403:
 *         description: Access denied.
 *       500:
 *         description: Internal server error.
 */
router.get(
    "/authors",
    authenticate,
    authorize("admin", "staff"),
    getAuthors
);

/**
 * @swagger
 * /authors/{id}:
 *   get:
 *     summary: Get author by ID
 *     description: Returns a single author by ID.
 *     tags:
 *       - Authors
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Author ID
 *     responses:
 *       200:
 *         description: Author retrieved successfully.
 *       401:
 *         description: Authentication required.
 *       403:
 *         description: Access denied.
 *       404:
 *         description: Author not found.
 *       500:
 *         description: Internal server error.
 */
router.get(
    "/authors/:id",
    authenticate,
    authorize("admin", "staff"),
    getAuthor
);

/**
 * @swagger
 * /authors/{id}:
 *   patch:
 *     summary: Update author
 *     description: Updates an existing author. Admin access only.
 *     tags:
 *       - Authors
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Author ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - isActive
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: "Robert"
 *               middleName:
 *                 type: string
 *                 nullable: true
 *                 example: null
 *               lastName:
 *                 type: string
 *                 example: "Martin"
 *               isActive:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Author updated successfully.
 *       400:
 *         description: Validation failed.
 *       401:
 *         description: Authentication required.
 *       403:
 *         description: Admin access required.
 *       404:
 *         description: Author not found.
 *       409:
 *         description: Another author with the same name already exists.
 *       500:
 *         description: Internal server error.
 */
router.patch(
    "/authors/:id",
    authenticate,
    authorize("admin"),
    validateRequest(updateAuthorSchema),
    updateAuthor
);

module.exports = router;
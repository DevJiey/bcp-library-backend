const express = require("express");

const {
    createCategory,
    getCategories,
    getCategory,
    updateCategory,
} = require("../controllers/CategoryController");

const authenticate = require("../middlewares/authenticate");
const authorize = require("../middlewares/authorize");
const validateRequest = require("../middlewares/validateRequest");

const {
    createCategorySchema,
    updateCategorySchema,
} = require("../validators/categoryValidator");

const router = express.Router();

/**
 * @swagger
 * /categories:
 *   post:
 *     summary: Create a new category
 *     description: Creates a new book category. Admin access only.
 *     tags:
 *       - Categories
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Cybersecurity"
 *               description:
 *                 type: string
 *                 nullable: true
 *                 example: "Books related to cybersecurity and information security."
 *     responses:
 *       201:
 *         description: Category created successfully.
 *       400:
 *         description: Validation failed.
 *       401:
 *         description: Authentication required.
 *       403:
 *         description: Admin access required.
 *       409:
 *         description: Category already exists.
 *       500:
 *         description: Internal server error.
 */
router.post(
    "/categories",
    authenticate,
    authorize("admin"),
    validateRequest(createCategorySchema),
    createCategory
);

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Get all categories
 *     description: Returns all book categories. Admin and Staff access.
 *     tags:
 *       - Categories
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Categories retrieved successfully.
 *       401:
 *         description: Authentication required.
 *       403:
 *         description: Access denied.
 *       500:
 *         description: Internal server error.
 */
router.get(
    "/categories",
    authenticate,
    authorize("admin", "staff"),
    getCategories
);

/**
 * @swagger
 * /categories/{id}:
 *   get:
 *     summary: Get category by ID
 *     description: Returns a single book category by ID.
 *     tags:
 *       - Categories
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Category ID
 *     responses:
 *       200:
 *         description: Category retrieved successfully.
 *       401:
 *         description: Authentication required.
 *       403:
 *         description: Access denied.
 *       404:
 *         description: Category not found.
 *       500:
 *         description: Internal server error.
 */
router.get(
    "/categories/:id",
    authenticate,
    authorize("admin", "staff"),
    getCategory
);

/**
 * @swagger
 * /categories/{id}:
 *   patch:
 *     summary: Update category
 *     description: Updates an existing book category. Admin access only.
 *     tags:
 *       - Categories
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Category ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - isActive
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Information Security"
 *               description:
 *                 type: string
 *                 nullable: true
 *                 example: "Updated category description."
 *               isActive:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Category updated successfully.
 *       400:
 *         description: Validation failed.
 *       401:
 *         description: Authentication required.
 *       403:
 *         description: Admin access required.
 *       404:
 *         description: Category not found.
 *       409:
 *         description: Another category with the same name already exists.
 *       500:
 *         description: Internal server error.
 */
router.patch(
    "/categories/:id",
    authenticate,
    authorize("admin"),
    validateRequest(updateCategorySchema),
    updateCategory
);

module.exports = router;
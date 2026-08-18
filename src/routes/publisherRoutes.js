const express = require("express");

const {
    createPublisher,
    getPublishers,
    getPublisher,
    updatePublisher,
} = require("../controllers/PublisherController");

const authenticate = require("../middlewares/authenticate");
const authorize = require("../middlewares/authorize");
const validateRequest = require("../middlewares/validateRequest");

const {
    createPublisherSchema,
    updatePublisherSchema,
} = require("../validators/publisherValidator");

const router = express.Router();

/**
 * @swagger
 * /publishers:
 *   post:
 *     summary: Create a new publisher
 *     description: Creates a new publisher. Admin access only.
 *     tags:
 *       - Publishers
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
 *                 example: "Pearson"
 *               address:
 *                 type: string
 *                 nullable: true
 *                 example: "Manila, Philippines"
 *               contactEmail:
 *                 type: string
 *                 format: email
 *                 nullable: true
 *                 example: "contact@pearson.com"
 *               contactNumber:
 *                 type: string
 *                 nullable: true
 *                 example: "09123456789"
 *     responses:
 *       201:
 *         description: Publisher created successfully.
 *       400:
 *         description: Validation failed.
 *       401:
 *         description: Authentication required.
 *       403:
 *         description: Admin access required.
 *       409:
 *         description: Publisher already exists.
 *       500:
 *         description: Internal server error.
 */
router.post(
    "/publishers",
    authenticate,
    authorize("admin"),
    validateRequest(createPublisherSchema),
    createPublisher
);

/**
 * @swagger
 * /publishers:
 *   get:
 *     summary: Get all publishers
 *     description: Returns all publishers. Admin and Staff access.
 *     tags:
 *       - Publishers
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Publishers retrieved successfully.
 *       401:
 *         description: Authentication required.
 *       403:
 *         description: Access denied.
 *       500:
 *         description: Internal server error.
 */
router.get(
    "/publishers",
    authenticate,
    authorize("admin", "staff"),
    getPublishers
);

/**
 * @swagger
 * /publishers/{id}:
 *   get:
 *     summary: Get publisher by ID
 *     description: Returns a single publisher by ID.
 *     tags:
 *       - Publishers
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Publisher ID
 *     responses:
 *       200:
 *         description: Publisher retrieved successfully.
 *       401:
 *         description: Authentication required.
 *       403:
 *         description: Access denied.
 *       404:
 *         description: Publisher not found.
 *       500:
 *         description: Internal server error.
 */
router.get(
    "/publishers/:id",
    authenticate,
    authorize("admin", "staff"),
    getPublisher
);

/**
 * @swagger
 * /publishers/{id}:
 *   patch:
 *     summary: Update publisher
 *     description: Updates an existing publisher. Admin access only.
 *     tags:
 *       - Publishers
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Publisher ID
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
 *                 example: "Pearson Education"
 *               address:
 *                 type: string
 *                 nullable: true
 *                 example: "Quezon City, Philippines"
 *               contactEmail:
 *                 type: string
 *                 format: email
 *                 nullable: true
 *                 example: "support@pearson.com"
 *               contactNumber:
 *                 type: string
 *                 nullable: true
 *                 example: "09123456789"
 *               isActive:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Publisher updated successfully.
 *       400:
 *         description: Validation failed.
 *       401:
 *         description: Authentication required.
 *       403:
 *         description: Admin access required.
 *       404:
 *         description: Publisher not found.
 *       409:
 *         description: Another publisher with the same name already exists.
 *       500:
 *         description: Internal server error.
 */
router.patch(
    "/publishers/:id",
    authenticate,
    authorize("admin"),
    validateRequest(updatePublisherSchema),
    updatePublisher
);

module.exports = router;
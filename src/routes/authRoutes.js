const express = require("express");

const {
    loginUser,
    getMe,
} = require("../controllers/AuthController");

const validateRequest = require("../middlewares/validateRequest");
const authenticate = require("../middlewares/authenticate");

const {
    loginSchema,
} = require("../validators/authValidator");

const router = express.Router();

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user
 *     description: Authenticates a borrower, staff, or admin using school ID and password.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - schoolId
 *               - password
 *             properties:
 *               schoolId:
 *                 type: string
 *                 example: "ADMIN-001"
 *               password:
 *                 type: string
 *                 example: "Admin12345"
 *     responses:
 *       200:
 *         description: Login successful.
 *       400:
 *         description: Validation failed.
 *       401:
 *         description: Invalid school ID or password.
 *       403:
 *         description: Account is inactive or suspended.
 *       500:
 *         description: Internal server error.
 */
router.post(
    "/auth/login",
    validateRequest(loginSchema),
    loginUser
);

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Get current authenticated user
 *     description: Returns the profile of the currently authenticated user.
 *     tags:
 *       - Authentication
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user retrieved successfully.
 *       401:
 *         description: Authentication required or invalid token.
 *       404:
 *         description: User account not found.
 *       500:
 *         description: Internal server error.
 */
router.get(
    "/auth/me",
    authenticate,
    getMe
);

module.exports = router;
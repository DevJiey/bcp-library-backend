const express = require("express");

const {
    loginUser,
    getMe,
    changeUserPassword,
} = require("../controllers/AuthController");

const validateRequest = require("../middlewares/validateRequest");
const authenticate = require("../middlewares/authenticate");

const {
    loginSchema,
    changePasswordSchema,
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
 *                 format: password
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

/**
 * @swagger
 * /auth/change-password:
 *   patch:
 *     summary: Change authenticated user's password
 *     description: Allows an authenticated user to change their password. A successful password change also completes the user's first-login requirement.
 *     tags:
 *       - Authentication
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 format: password
 *                 example: "CurrentPassword123"
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *                 maxLength: 72
 *                 example: "NewPassword123"
 *     responses:
 *       200:
 *         description: Password changed successfully.
 *       400:
 *         description: Validation failed, current password is incorrect, or new password matches the current password.
 *       401:
 *         description: Authentication required or invalid token.
 *       404:
 *         description: User account not found.
 *       500:
 *         description: Internal server error.
 */
router.patch(
    "/auth/change-password",
    authenticate,
    validateRequest(
        changePasswordSchema
    ),
    changeUserPassword
);

module.exports = router;
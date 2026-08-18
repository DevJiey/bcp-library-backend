const express = require("express");

const {
    createUserAccount,
    getUsers,
    getUser,
    getCurrentUserProfile,
    updateCurrentUserProfile,
    updateBorrowerAccount,
    updateUserAccountStatus,
} = require("../controllers/UserController");

const authenticate = require("../middlewares/authenticate");
const authorize = require("../middlewares/authorize");
const validateRequest = require("../middlewares/validateRequest");

const {
    createAccountSchema,
    updateAccountStatusSchema,
    updateMyProfileSchema,
    updateBorrowerSchema,
} = require("../validators/userValidator");

const router = express.Router();

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create borrower or staff account
 *     description: Creates a Student, Faculty, or Staff account. Admin access only.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - schoolId
 *               - email
 *               - password
 *               - firstName
 *               - lastName
 *               - role
 *             properties:
 *               schoolId:
 *                 type: string
 *                 example: "240116136"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "student@example.com"
 *               password:
 *                 type: string
 *                 example: "Password123"
 *               firstName:
 *                 type: string
 *                 example: "Juan"
 *               middleName:
 *                 type: string
 *                 nullable: true
 *                 example: "Dela"
 *               lastName:
 *                 type: string
 *                 example: "Cruz"
 *               role:
 *                 type: string
 *                 enum:
 *                   - borrower
 *                   - staff
 *                 example: "borrower"
 *               borrowerType:
 *                 type: string
 *                 enum:
 *                   - student
 *                   - faculty
 *                 example: "student"
 *               program:
 *                 type: string
 *                 example: "BSIT"
 *               yearLevel:
 *                 type: integer
 *                 example: 3
 *               section:
 *                 type: string
 *                 nullable: true
 *                 example: "31008"
 *               departmentId:
 *                 type: integer
 *                 example: 1
 *               position:
 *                 type: string
 *                 example: "Instructor"
 *               employmentStatus:
 *                 type: string
 *                 example: "active"
 *     responses:
 *       201:
 *         description: User account created successfully.
 *       400:
 *         description: Validation failed.
 *       401:
 *         description: Authentication required.
 *       403:
 *         description: Admin access required.
 *       409:
 *         description: School ID or email already exists.
 *       500:
 *         description: Internal server error.
 */
router.post(
    "/users",
    authenticate,
    authorize("admin"),
    validateRequest(createAccountSchema),
    createUserAccount
);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get users
 *     description: Admin sees all users. Staff sees borrowers only.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Users retrieved successfully.
 *       401:
 *         description: Authentication required.
 *       403:
 *         description: Access denied.
 *       500:
 *         description: Internal server error.
 */
router.get(
    "/users",
    authenticate,
    authorize("admin", "staff"),
    getUsers
);

/**
 * @swagger
 * /users/me/profile:
 *   get:
 *     summary: Get current borrower profile
 *     description: Returns the authenticated borrower's account and Student or Faculty profile information.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile retrieved successfully.
 *       401:
 *         description: Authentication required.
 *       403:
 *         description: Borrower access required.
 *       404:
 *         description: User account not found.
 *       500:
 *         description: Internal server error.
 */
router.get(
    "/users/me/profile",
    authenticate,
    authorize("borrower"),
    getCurrentUserProfile
);

/**
 * @swagger
 * /users/me/profile:
 *   patch:
 *     summary: Update current borrower profile
 *     description: Updates the authenticated borrower's personal and Student or Faculty profile information.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - firstName
 *               - lastName
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "student@example.com"
 *               firstName:
 *                 type: string
 *                 example: "Ronald"
 *               middleName:
 *                 type: string
 *                 nullable: true
 *                 example: "Jay"
 *               lastName:
 *                 type: string
 *                 example: "Cruz"
 *               program:
 *                 type: string
 *                 example: "BSIT"
 *               yearLevel:
 *                 type: integer
 *                 example: 3
 *               section:
 *                 type: string
 *                 nullable: true
 *                 example: "31008"
 *               departmentId:
 *                 type: integer
 *                 example: 1
 *               position:
 *                 type: string
 *                 nullable: true
 *                 example: "Instructor"
 *               employmentStatus:
 *                 type: string
 *                 example: "active"
 *     responses:
 *       200:
 *         description: Profile updated successfully.
 *       400:
 *         description: Validation failed.
 *       401:
 *         description: Authentication required.
 *       403:
 *         description: Borrower access required.
 *       404:
 *         description: User or borrower profile not found.
 *       409:
 *         description: Email already exists.
 *       500:
 *         description: Internal server error.
 */
router.patch(
    "/users/me/profile",
    authenticate,
    authorize("borrower"),
    validateRequest(updateMyProfileSchema),
    updateCurrentUserProfile
);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get user by ID
 *     description: Admin may view any user. Staff may view borrower accounts only.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     responses:
 *       200:
 *         description: User retrieved successfully.
 *       401:
 *         description: Authentication required.
 *       403:
 *         description: Access denied.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal server error.
 */
router.get(
    "/users/:id",
    authenticate,
    authorize("admin", "staff"),
    getUser
);

/**
 * @swagger
 * /users/{id}/profile:
 *   patch:
 *     summary: Update borrower information
 *     description: Updates another borrower's personal and profile information. Admin access only.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Borrower user ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - firstName
 *               - lastName
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "corrected.student@example.com"
 *               firstName:
 *                 type: string
 *                 example: "Juan"
 *               middleName:
 *                 type: string
 *                 nullable: true
 *                 example: "Dela"
 *               lastName:
 *                 type: string
 *                 example: "Cruz"
 *               program:
 *                 type: string
 *                 example: "BSIT"
 *               yearLevel:
 *                 type: integer
 *                 example: 3
 *               section:
 *                 type: string
 *                 nullable: true
 *                 example: "31008"
 *               departmentId:
 *                 type: integer
 *                 example: 1
 *               position:
 *                 type: string
 *                 nullable: true
 *                 example: "Instructor"
 *               employmentStatus:
 *                 type: string
 *                 example: "active"
 *     responses:
 *       200:
 *         description: Borrower information updated successfully.
 *       400:
 *         description: Validation failed or target is not a borrower.
 *       401:
 *         description: Authentication required.
 *       403:
 *         description: Admin access required.
 *       404:
 *         description: Borrower not found.
 *       409:
 *         description: Email already exists.
 *       500:
 *         description: Internal server error.
 */
router.patch(
    "/users/:id/profile",
    authenticate,
    authorize("admin"),
    validateRequest(updateBorrowerSchema),
    updateBorrowerAccount
);

/**
 * @swagger
 * /users/{id}/status:
 *   patch:
 *     summary: Update user account status
 *     description: Updates a user's account status. Admin access only.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - accountStatus
 *             properties:
 *               accountStatus:
 *                 type: string
 *                 enum:
 *                   - active
 *                   - locked
 *                   - inactive
 *                   - suspended
 *                 example: "suspended"
 *     responses:
 *       200:
 *         description: User account status updated successfully.
 *       400:
 *         description: Validation failed.
 *       401:
 *         description: Authentication required.
 *       403:
 *         description: Admin access required.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal server error.
 */
router.patch(
    "/users/:id/status",
    authenticate,
    authorize("admin"),
    validateRequest(updateAccountStatusSchema),
    updateUserAccountStatus
);

module.exports = router;
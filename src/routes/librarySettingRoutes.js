const express = require("express");

const {
    getLibrarySettings,
    getLibrarySetting,
    updateLibrarySetting,
} = require("../controllers/LibrarySettingController");

const authenticate = require("../middlewares/authenticate");
const authorize = require("../middlewares/authorize");
const validateRequest = require("../middlewares/validateRequest");

const {
    updateLibrarySettingSchema,
} = require("../validators/librarySettingValidator");

const router = express.Router();

/**
 * @swagger
 * /settings:
 *   get:
 *     summary: Get all library settings
 *     description: Returns all configurable library settings. Admin access only.
 *     tags:
 *       - Settings
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Library settings retrieved successfully.
 *       401:
 *         description: Authentication required.
 *       403:
 *         description: Admin access required.
 *       500:
 *         description: Internal server error.
 */
router.get(
    "/settings",
    authenticate,
    authorize("admin"),
    getLibrarySettings
);

/**
 * @swagger
 * /settings/{key}:
 *   get:
 *     summary: Get library setting by key
 *     description: Returns one library setting by key. Admin access only.
 *     tags:
 *       - Settings
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: key
 *         required: true
 *         schema:
 *           type: string
 *         example: "student_borrow_limit"
 *     responses:
 *       200:
 *         description: Library setting retrieved successfully.
 *       401:
 *         description: Authentication required.
 *       403:
 *         description: Admin access required.
 *       404:
 *         description: Library setting not found.
 *       500:
 *         description: Internal server error.
 */
router.get(
    "/settings/:key",
    authenticate,
    authorize("admin"),
    getLibrarySetting
);

/**
 * @swagger
 * /settings/{key}:
 *   patch:
 *     summary: Update library setting
 *     description: Updates an allowed library setting. Admin access only.
 *     tags:
 *       - Settings
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: key
 *         required: true
 *         schema:
 *           type: string
 *           enum:
 *             - student_borrow_limit
 *             - faculty_borrow_limit
 *             - borrowing_period_days
 *         example: "student_borrow_limit"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - settingValue
 *             properties:
 *               settingValue:
 *                 oneOf:
 *                   - type: integer
 *                   - type: string
 *                 example: 3
 *     responses:
 *       200:
 *         description: Library setting updated successfully.
 *       400:
 *         description: Invalid setting or setting value.
 *       401:
 *         description: Authentication required.
 *       403:
 *         description: Admin access required.
 *       404:
 *         description: Library setting not found.
 *       500:
 *         description: Internal server error.
 */
router.patch(
    "/settings/:key",
    authenticate,
    authorize("admin"),
    validateRequest(updateLibrarySettingSchema),
    updateLibrarySetting
);

module.exports = router;
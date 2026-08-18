const express = require("express");

const {
    createAnnouncement,
    getAdminAnnouncements,
    getMyAnnouncements,
    updateAnnouncement,
} = require("../controllers/AnnouncementController");

const authenticate = require("../middlewares/authenticate");
const authorize = require("../middlewares/authorize");
const validateRequest = require("../middlewares/validateRequest");

const {
    createAnnouncementSchema,
    updateAnnouncementSchema,
} = require("../validators/announcementValidator");

const router = express.Router();

/**
 * @swagger
 * /announcements:
 *   post:
 *     summary: Create announcement
 *     description: Creates a new library announcement. Admin access only.
 *     tags:
 *       - Announcements
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
 *               - message
 *               - audience
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Library Schedule Update"
 *               message:
 *                 type: string
 *                 example: "The library will close at 5:00 PM today."
 *               audience:
 *                 type: string
 *                 enum:
 *                   - all
 *                   - borrowers
 *                   - students
 *                   - faculty
 *                   - staff
 *                 example: "all"
 *               status:
 *                 type: string
 *                 enum:
 *                   - draft
 *                   - published
 *                 example: "published"
 *     responses:
 *       201:
 *         description: Announcement created successfully.
 *       400:
 *         description: Validation failed.
 *       401:
 *         description: Authentication required.
 *       403:
 *         description: Admin access required.
 *       500:
 *         description: Internal server error.
 */
router.post(
    "/announcements",
    authenticate,
    authorize("admin"),
    validateRequest(createAnnouncementSchema),
    createAnnouncement
);

/**
 * @swagger
 * /announcements/admin:
 *   get:
 *     summary: Get all announcements for admin
 *     description: Returns all announcements including draft, published, and archived records.
 *     tags:
 *       - Announcements
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Announcements retrieved successfully.
 *       401:
 *         description: Authentication required.
 *       403:
 *         description: Admin access required.
 *       500:
 *         description: Internal server error.
 */
router.get(
    "/announcements/admin",
    authenticate,
    authorize("admin"),
    getAdminAnnouncements
);

/**
 * @swagger
 * /announcements/me:
 *   get:
 *     summary: Get announcements for current user
 *     description: Returns published announcements that match the authenticated user's role or borrower type.
 *     tags:
 *       - Announcements
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Announcements retrieved successfully.
 *       401:
 *         description: Authentication required.
 *       500:
 *         description: Internal server error.
 */
router.get(
    "/announcements/me",
    authenticate,
    getMyAnnouncements
);

/**
 * @swagger
 * /announcements/{id}:
 *   patch:
 *     summary: Update announcement
 *     description: Updates an existing announcement. Admin access only.
 *     tags:
 *       - Announcements
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Announcement ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - message
 *               - audience
 *               - status
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Updated Library Schedule"
 *               message:
 *                 type: string
 *                 example: "The library will close at 6:00 PM today."
 *               audience:
 *                 type: string
 *                 enum:
 *                   - all
 *                   - borrowers
 *                   - students
 *                   - faculty
 *                   - staff
 *                 example: "students"
 *               status:
 *                 type: string
 *                 enum:
 *                   - draft
 *                   - published
 *                   - archived
 *                 example: "published"
 *     responses:
 *       200:
 *         description: Announcement updated successfully.
 *       400:
 *         description: Validation failed.
 *       401:
 *         description: Authentication required.
 *       403:
 *         description: Admin access required.
 *       404:
 *         description: Announcement not found.
 *       500:
 *         description: Internal server error.
 */
router.patch(
    "/announcements/:id",
    authenticate,
    authorize("admin"),
    validateRequest(updateAnnouncementSchema),
    updateAnnouncement
);

module.exports = router;
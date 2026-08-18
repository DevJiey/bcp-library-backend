const express = require("express");

const {
    createDatabaseBackup,
    getDatabaseBackups,
    downloadDatabaseBackup,
    restoreDatabaseBackup,
} = require("../controllers/BackupController");

const authenticate = require("../middlewares/authenticate");
const authorize = require("../middlewares/authorize");
const validateRequest = require("../middlewares/validateRequest");

const {
    restoreBackupSchema,
} = require("../validators/backupValidator");

const router = express.Router();

/**
 * @swagger
 * /backup:
 *   post:
 *     summary: Create database backup
 *     description: Creates a PostgreSQL database backup. Admin access only.
 *     tags:
 *       - Backup & Restore
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Database backup created successfully.
 *       401:
 *         description: Authentication required.
 *       403:
 *         description: Admin access required.
 *       500:
 *         description: Database backup failed.
 */
router.post(
    "/backup",
    authenticate,
    authorize("admin"),
    createDatabaseBackup
);

/**
 * @swagger
 * /backups:
 *   get:
 *     summary: Get available database backups
 *     description: Returns all available PostgreSQL backup files. Admin access only.
 *     tags:
 *       - Backup & Restore
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Database backups retrieved successfully.
 *       401:
 *         description: Authentication required.
 *       403:
 *         description: Admin access required.
 *       500:
 *         description: Failed to retrieve database backups.
 */
router.get(
    "/backups",
    authenticate,
    authorize("admin"),
    getDatabaseBackups
);
/**
 * @swagger
 * /backups/{fileName}/download:
 *   get:
 *     summary: Download database backup
 *     description: Downloads a selected PostgreSQL backup file. Admin access only.
 *     tags:
 *       - Backup & Restore
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: fileName
 *         required: true
 *         schema:
 *           type: string
 *         description: Backup file name
 *         example: "bcp-library-backup-2026-08-17T09-30-00-000Z.sql"
 *     responses:
 *       200:
 *         description: Backup file downloaded successfully.
 *         content:
 *           application/sql:
 *             schema:
 *               type: string
 *               format: binary
 *       400:
 *         description: Invalid backup file name.
 *       401:
 *         description: Authentication required.
 *       403:
 *         description: Admin access required.
 *       404:
 *         description: Backup file not found.
 *       500:
 *         description: Failed to download backup.
 */
router.get(
    "/backups/:fileName/download",
    authenticate,
    authorize("admin"),
    downloadDatabaseBackup
);
/**
 * @swagger
 * /restore:
 *   post:
 *     summary: Restore database backup
 *     description: Restores the PostgreSQL database using an existing server backup file. Admin access only.
 *     tags:
 *       - Backup & Restore
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fileName
 *             properties:
 *               fileName:
 *                 type: string
 *                 example: "bcp-library-backup-2026-08-18T00-00-00-000Z.sql"
 *     responses:
 *       200:
 *         description: Database restored successfully.
 *       400:
 *         description: Invalid backup file name.
 *       401:
 *         description: Authentication required.
 *       403:
 *         description: Admin access required.
 *       404:
 *         description: Backup file not found.
 *       500:
 *         description: Database restore failed.
 */
router.post(
    "/restore",
    authenticate,
    authorize("admin"),
    validateRequest(restoreBackupSchema),
    restoreDatabaseBackup
);

module.exports = router;
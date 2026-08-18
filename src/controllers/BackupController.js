const {
    backupDatabase,
    listDatabaseBackups,
    getBackupFile,
    restoreDatabase,
} = require("../services/BackupService");

const {
    recordAuditLog,
} = require("../services/AuditLogService");

const {
    getRequestMetadata,
} = require("../utils/requestMetadata");

const asyncHandler = require("../middlewares/asyncHandler");

const createDatabaseBackup = asyncHandler(
    async (req, res) => {
        const backup = await backupDatabase();

        const {
            ipAddress,
            userAgent,
        } = getRequestMetadata(req);

        await recordAuditLog({
            userId: req.user.id,
            action: "BACKUP_DATABASE",
            module: "Backup",
            entityType: "database_backup",
            entityId: null,
            description:
                `Created database backup ${backup.fileName}.`,
            ipAddress,
            userAgent,
        });

        return res.status(201).json({
            success: true,
            message:
                "Database backup created successfully.",
            data: backup,
        });
    }
);

const getDatabaseBackups = asyncHandler(
    async (req, res) => {
        const backups =
            await listDatabaseBackups();

        return res.status(200).json({
            success: true,
            message:
                "Database backups retrieved successfully.",
            data: backups,
        });
    }
);

const downloadDatabaseBackup = asyncHandler(
    async (req, res, next) => {
        const backup = await getBackupFile(
            req.params.fileName
        );

        return res.download(
            backup.filePath,
            backup.fileName,
            (error) => {
                if (error) {
                    return next(error);
                }
            }
        );
    }
);

const restoreDatabaseBackup = asyncHandler(
    async (req, res) => {
        const result = await restoreDatabase(
            req.body.fileName
        );

        const {
            ipAddress,
            userAgent,
        } = getRequestMetadata(req);

        await recordAuditLog({
            userId: req.user.id,
            action: "RESTORE_DATABASE",
            module: "Backup",
            entityType: "database_backup",
            entityId: null,
            description:
                `Restored database using backup ${result.fileName}.`,
            ipAddress,
            userAgent,
        });

        return res.status(200).json({
            success: true,
            message:
                "Database restored successfully.",
            data: result,
        });
    }
);

module.exports = {
    createDatabaseBackup,
    getDatabaseBackups,
    downloadDatabaseBackup,
    restoreDatabaseBackup,
};
const { execFile } = require("child_process");
const fs = require("fs");
const util = require("util");

const {
    getBackupDirectory,
    getBackupFilePath,
    isValidBackupFileName,
} = require("../utils/backupFile");

const AppError = require("../utils/AppError");

const execFileAsync = util.promisify(execFile);

const PG_DUMP_PATH =
    "C:\\Program Files\\PostgreSQL\\18\\bin\\pg_dump.exe";

const PSQL_PATH =
    "C:\\Program Files\\PostgreSQL\\18\\bin\\psql.exe";

const getDatabaseConfig = () => {
    const {
        DB_HOST,
        DB_PORT,
        DB_NAME,
        DB_USER,
        DB_PASSWORD,
    } = process.env;

    if (
        !DB_HOST ||
        !DB_PORT ||
        !DB_NAME ||
        !DB_USER
    ) {
        throw new AppError(
            "Database configuration is incomplete.",
            500
        );
    }

    return {
        DB_HOST,
        DB_PORT,
        DB_NAME,
        DB_USER,
        DB_PASSWORD,
    };
};

const backupDatabase = async () => {
    const backupDirectory = getBackupDirectory();

    if (!fs.existsSync(backupDirectory)) {
        fs.mkdirSync(backupDirectory, {
            recursive: true,
        });
    }

    const timestamp = new Date()
        .toISOString()
        .replace(/[:.]/g, "-");

    const fileName =
        `bcp-library-backup-${timestamp}.sql`;

    const filePath =
        getBackupFilePath(fileName);

    const {
        DB_HOST,
        DB_PORT,
        DB_NAME,
        DB_USER,
        DB_PASSWORD,
    } = getDatabaseConfig();

    try {
        await execFileAsync(
            PG_DUMP_PATH,
            [
                "-h",
                DB_HOST,
                "-p",
                DB_PORT,
                "-U",
                DB_USER,
                "-d",
                DB_NAME,
                "-F",
                "p",
                "--clean",
                "--if-exists",
                "--no-owner",
                "--no-privileges",
                "-f",
                filePath,
            ],
            {
                env: {
                    ...process.env,
                    PGPASSWORD:
                        DB_PASSWORD || "",
                },
            }
        );

        const stats =
            fs.statSync(filePath);

        return {
            fileName,
            filePath,
            size: stats.size,
            createdAt:
                new Date().toISOString(),
        };
    } catch (error) {
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        throw new AppError(
            `Database backup failed: ${error.message}`,
            500
        );
    }
};

const listDatabaseBackups = async () => {
    const backupDirectory =
        getBackupDirectory();

    if (!fs.existsSync(backupDirectory)) {
        return [];
    }

    const files =
        fs.readdirSync(backupDirectory);

    const backups = files
        .filter((fileName) =>
            isValidBackupFileName(fileName)
        )
        .map((fileName) => {
            const filePath =
                getBackupFilePath(fileName);

            const stats =
                fs.statSync(filePath);

            return {
                fileName,
                size: stats.size,
                createdAt: stats.birthtime,
                modifiedAt: stats.mtime,
            };
        })
        .sort(
            (a, b) =>
                new Date(b.createdAt) -
                new Date(a.createdAt)
        );

    return backups;
};

const getBackupFile = async (fileName) => {
    if (!fileName) {
        throw new AppError(
            "Backup file name is required.",
            400
        );
    }

    if (!isValidBackupFileName(fileName)) {
        throw new AppError(
            "Invalid backup file name.",
            400
        );
    }

    const filePath =
        getBackupFilePath(fileName);

    if (!fs.existsSync(filePath)) {
        throw new AppError(
            "Backup file not found.",
            404
        );
    }

    const stats =
        fs.statSync(filePath);

    if (!stats.isFile()) {
        throw new AppError(
            "Backup file not found.",
            404
        );
    }

    return {
        fileName,
        filePath,
    };
};

const restoreDatabase = async (fileName) => {
    const backup =
        await getBackupFile(fileName);

    const {
        DB_HOST,
        DB_PORT,
        DB_NAME,
        DB_USER,
        DB_PASSWORD,
    } = getDatabaseConfig();

    try {
        await execFileAsync(
            PSQL_PATH,
            [
                "-h",
                DB_HOST,
                "-p",
                DB_PORT,
                "-U",
                DB_USER,
                "-d",
                DB_NAME,
                "-v",
                "ON_ERROR_STOP=1",
                "-f",
                backup.filePath,
            ],
            {
                env: {
                    ...process.env,
                    PGPASSWORD:
                        DB_PASSWORD || "",
                },
                maxBuffer:
                    20 * 1024 * 1024,
            }
        );

        return {
            fileName: backup.fileName,
            restoredAt:
                new Date().toISOString(),
        };
    } catch (error) {
        throw new AppError(
            `Database restore failed: ${
                error.stderr ||
                error.message
            }`,
            500
        );
    }
};

module.exports = {
    backupDatabase,
    listDatabaseBackups,
    getBackupFile,
    restoreDatabase,
};
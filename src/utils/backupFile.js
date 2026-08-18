const path = require("path");

const isValidBackupFileName = (fileName) => {
    if (
        !fileName ||
        typeof fileName !== "string"
    ) {
        return false;
    }

    const safeFileName = path.basename(fileName);

    if (safeFileName !== fileName) {
        return false;
    }

    if (
        !safeFileName.startsWith(
            "bcp-library-backup-"
        )
    ) {
        return false;
    }

    if (!safeFileName.endsWith(".sql")) {
        return false;
    }

    if (
        safeFileName.includes("..") ||
        safeFileName.includes("/") ||
        safeFileName.includes("\\")
    ) {
        return false;
    }

    return true;
};

const getBackupDirectory = () => {
    return path.join(
        process.cwd(),
        "backups"
    );
};

const getBackupFilePath = (fileName) => {
    return path.join(
        getBackupDirectory(),
        fileName
    );
};

module.exports = {
    isValidBackupFileName,
    getBackupDirectory,
    getBackupFilePath,
};
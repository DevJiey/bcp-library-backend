const { z } = require("zod");

const {
    isValidBackupFileName,
} = require("../utils/backupFile");

const restoreBackupSchema = z.object({
    fileName: z
        .string()
        .trim()
        .min(1, "Backup file name is required.")
        .refine(
            isValidBackupFileName,
            {
                message: "Invalid backup file name.",
            }
        ),
});

module.exports = {
    restoreBackupSchema,
};
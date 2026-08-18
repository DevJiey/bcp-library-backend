const { z } = require("zod");

const approveBorrowRequestSchema = z.object({
    barcode: z
        .string()
        .trim()
        .min(1, "Barcode is required.")
        .max(100, "Barcode must not exceed 100 characters."),
});

const rejectBorrowRequestSchema = z.object({
    rejectionReason: z
        .string()
        .trim()
        .min(1, "Rejection reason is required.")
        .max(500, "Rejection reason must not exceed 500 characters."),
});

module.exports = {
    approveBorrowRequestSchema,
    rejectBorrowRequestSchema,
};
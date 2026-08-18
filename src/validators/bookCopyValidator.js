const { z } = require("zod");

const createBookCopySchema = z.object({
    bookId: z
        .number()
        .int()
        .positive("Book ID must be valid."),

    accessionNumber: z
        .string()
        .trim()
        .min(1, "Accession number is required.")
        .max(
            50,
            "Accession number must not exceed 50 characters."
        ),

    barcode: z
        .string()
        .trim()
        .min(1, "Barcode is required.")
        .max(
            100,
            "Barcode must not exceed 100 characters."
        ),

    shelfLocation: z
        .string()
        .trim()
        .max(
            100,
            "Shelf location must not exceed 100 characters."
        )
        .optional()
        .nullable(),

    condition: z
        .enum([
            "excellent",
            "good",
            "fair",
            "poor",
            "damaged",
            "lost",
        ])
        .optional()
        .default("good"),

    acquiredAt: z
        .string()
        .regex(
            /^\d{4}-\d{2}-\d{2}$/,
            "Acquired date must use YYYY-MM-DD format."
        )
        .optional()
        .nullable(),
});

module.exports = {
    createBookCopySchema,
};
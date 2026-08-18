const { z } = require("zod");

const processReturnSchema = z.object({
    barcode: z
        .string()
        .trim()
        .min(1, "Barcode is required.")
        .max(100, "Barcode must not exceed 100 characters."),

    conditionOnReturn: z.enum([
        "excellent",
        "good",
        "fair",
        "poor",
        "damaged",
        "lost",
    ]),

    remarks: z
        .string()
        .trim()
        .max(500, "Remarks must not exceed 500 characters.")
        .optional()
        .nullable(),
});

module.exports = {
    processReturnSchema,
};
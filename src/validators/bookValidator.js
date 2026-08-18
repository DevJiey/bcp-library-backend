const { z } = require("zod");

const createBookSchema = z.object({
    isbn: z
        .string()
        .trim()
        .max(30, "ISBN must not exceed 30 characters.")
        .optional()
        .nullable(),

    title: z
        .string()
        .trim()
        .min(1, "Book title is required.")
        .max(255, "Book title must not exceed 255 characters."),

    categoryId: z
        .number()
        .int()
        .positive("Category ID must be valid.")
        .optional()
        .nullable(),

    publisherId: z
        .number()
        .int()
        .positive("Publisher ID must be valid.")
        .optional()
        .nullable(),

    publicationYear: z
        .number()
        .int()
        .min(1000, "Publication year must be at least 1000.")
        .max(9999, "Publication year must not exceed 9999.")
        .optional()
        .nullable(),

    edition: z
        .string()
        .trim()
        .max(100, "Edition must not exceed 100 characters.")
        .optional()
        .nullable(),

    description: z
        .string()
        .trim()
        .optional()
        .nullable(),

    coverImageUrl: z
        .string()
        .trim()
        .url("Cover image URL must be a valid URL.")
        .optional()
        .nullable(),

    authorIds: z
        .array(
            z
                .number()
                .int()
                .positive("Author ID must be valid.")
        )
        .min(1, "At least one author is required."),
});

module.exports = {
    createBookSchema,
};
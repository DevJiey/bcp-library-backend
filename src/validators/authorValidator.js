const { z } = require("zod");

const createAuthorSchema = z.object({
    firstName: z
        .string()
        .trim()
        .min(1, "First name is required.")
        .max(100, "First name must not exceed 100 characters."),

    middleName: z
        .string()
        .trim()
        .max(100, "Middle name must not exceed 100 characters.")
        .optional()
        .nullable(),

    lastName: z
        .string()
        .trim()
        .min(1, "Last name is required.")
        .max(100, "Last name must not exceed 100 characters."),
});

const updateAuthorSchema = z.object({
    firstName: z
        .string()
        .trim()
        .min(1, "First name is required.")
        .max(100, "First name must not exceed 100 characters."),

    middleName: z
        .string()
        .trim()
        .max(100, "Middle name must not exceed 100 characters.")
        .optional()
        .nullable(),

    lastName: z
        .string()
        .trim()
        .min(1, "Last name is required.")
        .max(100, "Last name must not exceed 100 characters."),

    isActive: z.boolean(),
});

module.exports = {
    createAuthorSchema,
    updateAuthorSchema,
};
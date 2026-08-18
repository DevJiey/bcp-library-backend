const { z } = require("zod");

const createCategorySchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, "Category name is required.")
        .max(150, "Category name must not exceed 150 characters."),

    description: z
        .string()
        .trim()
        .max(500, "Description must not exceed 500 characters.")
        .optional()
        .nullable(),
});

const updateCategorySchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, "Category name is required.")
        .max(150, "Category name must not exceed 150 characters."),

    description: z
        .string()
        .trim()
        .max(500, "Description must not exceed 500 characters.")
        .optional()
        .nullable(),

    isActive: z.boolean(),
});

module.exports = {
    createCategorySchema,
    updateCategorySchema,
};
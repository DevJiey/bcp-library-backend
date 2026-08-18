const { z } = require("zod");

const createPublisherSchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, "Publisher name is required.")
        .max(150, "Publisher name must not exceed 150 characters."),

    address: z
        .string()
        .trim()
        .optional()
        .nullable(),

    contactEmail: z
        .string()
        .trim()
        .email("Please provide a valid contact email.")
        .max(255)
        .optional()
        .nullable(),

    contactNumber: z
        .string()
        .trim()
        .max(50, "Contact number must not exceed 50 characters.")
        .optional()
        .nullable(),
});

const updatePublisherSchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, "Publisher name is required.")
        .max(150, "Publisher name must not exceed 150 characters."),

    address: z
        .string()
        .trim()
        .optional()
        .nullable(),

    contactEmail: z
        .string()
        .trim()
        .email("Please provide a valid contact email.")
        .max(255)
        .optional()
        .nullable(),

    contactNumber: z
        .string()
        .trim()
        .max(50, "Contact number must not exceed 50 characters.")
        .optional()
        .nullable(),

    isActive: z.boolean(),
});

module.exports = {
    createPublisherSchema,
    updatePublisherSchema,
};
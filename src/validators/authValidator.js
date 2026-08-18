const { z } = require("zod");

const loginSchema = z.object({
    schoolId: z
        .string()
        .trim()
        .min(1, "School ID is required."),

    password: z
        .string()
        .min(1, "Password is required."),
});

module.exports = {
    loginSchema,
};
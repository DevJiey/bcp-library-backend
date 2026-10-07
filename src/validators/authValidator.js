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

const changePasswordSchema = z.object({
    currentPassword: z
        .string()
        .min(
            1,
            "Current password is required."
        ),

    newPassword: z
        .string()
        .min(
            8,
            "New password must be at least 8 characters."
        )
        .max(
            72,
            "New password must not exceed 72 characters."
        )
        .regex(
            /[A-Z]/,
            "New password must contain at least one uppercase letter."
        )
        .regex(
            /[a-z]/,
            "New password must contain at least one lowercase letter."
        )
        .regex(
            /[0-9]/,
            "New password must contain at least one number."
        ),
});

module.exports = {
    loginSchema,
    changePasswordSchema,
};
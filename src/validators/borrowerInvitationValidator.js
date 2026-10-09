
const { z } = require("zod");

const invitationTokenSchema = z
    .string()
    .regex(
        /^[a-f0-9]{64}$/i,
        "Invalid invitation token."
    );

const createBorrowerInvitationSchema = z
    .object({
        schoolId: z
            .string()
            .trim()
            .min(1)
            .max(50),

        email: z
            .string()
            .trim()
            .email()
            .max(255),

        firstName: z
            .string()
            .trim()
            .min(1)
            .max(100),

        middleName: z
            .string()
            .trim()
            .max(100)
            .optional()
            .nullable(),

        lastName: z
            .string()
            .trim()
            .min(1)
            .max(100),

        borrowerType: z.enum([
            "student",
            "faculty",
        ]),

        program: z
            .string()
            .trim()
            .min(1)
            .max(100)
            .optional(),

        yearLevel: z
            .number()
            .int()
            .min(1)
            .max(6)
            .optional(),

        section: z
            .string()
            .trim()
            .max(100)
            .optional()
            .nullable(),

        departmentId: z
            .number()
            .int()
            .positive()
            .optional(),

        position: z
            .string()
            .trim()
            .max(150)
            .optional()
            .nullable(),

        employmentStatus: z
            .string()
            .trim()
            .max(50)
            .optional(),
    })
    .superRefine((data, ctx) => {
        if (data.borrowerType === "student") {
            if (!data.program) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ["program"],
                    message:
                        "Program is required for students.",
                });
            }

            if (!data.yearLevel) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ["yearLevel"],
                    message:
                        "Year level is required for students.",
                });
            }
        }

        if (data.borrowerType === "faculty") {
            if (!data.departmentId) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ["departmentId"],
                    message:
                        "Department is required for faculty.",
                });
            }
        }
    });

const verifyInvitationSchema = z.object({
    token: invitationTokenSchema,
});

const acceptInvitationSchema = z.object({
    token: invitationTokenSchema,

    password: z
        .string()
        .min(
            8,
            "Password must be at least 8 characters."
        )
        .max(
            72,
            "Password must not exceed 72 characters."
        )
        .regex(
            /[A-Z]/,
            "Password must contain at least one uppercase letter."
        )
        .regex(
            /[a-z]/,
            "Password must contain at least one lowercase letter."
        )
        .regex(
            /[0-9]/,
            "Password must contain at least one number."
        ),
});

module.exports = {
    createBorrowerInvitationSchema,
    verifyInvitationSchema,
    acceptInvitationSchema,
};

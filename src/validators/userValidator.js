const { z } = require("zod");

const createAccountSchema = z
    .object({
        schoolId: z
            .string()
            .trim()
            .min(1, "School ID is required.")
            .max(50),

        email: z
            .string()
            .trim()
            .email("Please provide a valid email address.")
            .max(255),

        password: z
            .string()
            .min(8, "Password must be at least 8 characters long."),

        firstName: z
            .string()
            .trim()
            .min(1, "First name is required.")
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
            .min(1, "Last name is required.")
            .max(100),

        role: z.enum([
            "borrower",
            "staff",
        ]),

        borrowerType: z
            .enum([
                "student",
                "faculty",
            ])
            .optional(),

        program: z
            .string()
            .trim()
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
            .optional(),

        employmentStatus: z
            .string()
            .trim()
            .max(50)
            .optional(),
    })
    .superRefine((data, ctx) => {
        if (
            data.role === "borrower" &&
            !data.borrowerType
        ) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["borrowerType"],
                message: "Borrower type is required.",
            });
        }

        if (
            data.role === "staff" &&
            data.borrowerType
        ) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["borrowerType"],
                message: "Borrower type must not be provided for staff accounts.",
            });
        }

        if (
            data.role === "borrower" &&
            data.borrowerType === "student"
        ) {
            if (!data.program) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ["program"],
                    message: "Program is required for student borrowers.",
                });
            }

            if (!data.yearLevel) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ["yearLevel"],
                    message: "Year level is required for student borrowers.",
                });
            }
        }

        if (
            data.role === "borrower" &&
            data.borrowerType === "faculty"
        ) {
            if (!data.departmentId) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ["departmentId"],
                    message: "Department is required for faculty borrowers.",
                });
            }

            if (!data.employmentStatus) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ["employmentStatus"],
                    message: "Employment status is required for faculty borrowers.",
                });
            }
        }

        if (
            data.role !== "borrower" ||
            data.borrowerType !== "student"
        ) {
            const studentFields = [
                ["program", data.program],
                ["yearLevel", data.yearLevel],
                ["section", data.section],
            ];

            studentFields.forEach(([field, value]) => {
                if (
                    value !== undefined &&
                    value !== null
                ) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        path: [field],
                        message: `${field} must only be provided for student borrowers.`,
                    });
                }
            });
        }

        if (
            data.role !== "borrower" ||
            data.borrowerType !== "faculty"
        ) {
            const facultyFields = [
                ["departmentId", data.departmentId],
                ["position", data.position],
                ["employmentStatus", data.employmentStatus],
            ];

            facultyFields.forEach(([field, value]) => {
                if (
                    value !== undefined &&
                    value !== null
                ) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        path: [field],
                        message: `${field} must only be provided for faculty borrowers.`,
                    });
                }
            });
        }
    });
const updateAccountStatusSchema = z.object({
    accountStatus: z.enum([
        "active",
        "locked",
        "inactive",
        "suspended",
    ]),
});
const updateMyProfileSchema = z
    .object({
        email: z
            .string()
            .trim()
            .email("Please provide a valid email address.")
            .max(255),

        firstName: z
            .string()
            .trim()
            .min(1, "First name is required.")
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
            .min(1, "Last name is required.")
            .max(100),

        program: z
            .string()
            .trim()
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
        const hasStudentFields =
            data.program !== undefined ||
            data.yearLevel !== undefined ||
            data.section !== undefined;

        const hasFacultyFields =
            data.departmentId !== undefined ||
            data.position !== undefined ||
            data.employmentStatus !== undefined;

        if (
            hasStudentFields &&
            hasFacultyFields
        ) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message:
                    "Student and faculty profile fields cannot be updated together.",
            });
        }

        if (hasStudentFields) {
            if (!data.program) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ["program"],
                    message:
                        "Program is required for student profile updates.",
                });
            }

            if (!data.yearLevel) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ["yearLevel"],
                    message:
                        "Year level is required for student profile updates.",
                });
            }
        }

        if (hasFacultyFields) {
            if (!data.departmentId) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ["departmentId"],
                    message:
                        "Department is required for faculty profile updates.",
                });
            }

            if (!data.employmentStatus) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ["employmentStatus"],
                    message:
                        "Employment status is required for faculty profile updates.",
                });
            }
        }
    });

module.exports = {
    createAccountSchema,
    updateAccountStatusSchema,
    updateMyProfileSchema,
};
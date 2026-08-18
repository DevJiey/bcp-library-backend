const { z } = require("zod");

const createAnnouncementSchema = z.object({
    title: z
        .string()
        .trim()
        .min(1, "Announcement title is required.")
        .max(255, "Announcement title must not exceed 255 characters."),

    message: z
        .string()
        .trim()
        .min(1, "Announcement message is required."),

    audience: z.enum([
        "all",
        "borrowers",
        "students",
        "faculty",
        "staff",
    ]),

    status: z
        .enum([
            "draft",
            "published",
        ])
        .default("published"),
});

const updateAnnouncementSchema = z.object({
    title: z
        .string()
        .trim()
        .min(1, "Announcement title is required.")
        .max(255, "Announcement title must not exceed 255 characters."),

    message: z
        .string()
        .trim()
        .min(1, "Announcement message is required."),

    audience: z.enum([
        "all",
        "borrowers",
        "students",
        "faculty",
        "staff",
    ]),

    status: z.enum([
        "draft",
        "published",
        "archived",
    ]),
});

module.exports = {
    createAnnouncementSchema,
    updateAnnouncementSchema,
};
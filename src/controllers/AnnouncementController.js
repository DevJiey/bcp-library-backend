const {
    addAnnouncement,
    listAnnouncementsForAdmin,
    listAnnouncementsForCurrentUser,
    editAnnouncement,
} = require("../services/AnnouncementService");

const {
    recordAuditLog,
} = require("../services/AuditLogService");

const {
    getRequestMetadata,
} = require("../utils/requestMetadata");

const asyncHandler = require("../middlewares/asyncHandler");

const createAnnouncement = asyncHandler(
    async (req, res) => {
        const result = await addAnnouncement({
            title: req.body.title,
            message: req.body.message,
            audience: req.body.audience,
            status: req.body.status,
            postedBy: req.user.id,
        });

        const {
            ipAddress,
            userAgent,
        } = getRequestMetadata(req);

        await recordAuditLog({
            userId: req.user.id,
            action: "CREATE_ANNOUNCEMENT",
            module: "Announcements",
            entityType: "announcement",
            entityId: result.announcement.id,
            description:
                `Created announcement "${result.announcement.title}" for audience ${result.announcement.audience} with status ${result.announcement.status}.`,
            ipAddress,
            userAgent,
        });

        return res.status(201).json({
            success: true,
            message: "Announcement created successfully.",
            data: result,
        });
    }
);

const getAdminAnnouncements = asyncHandler(
    async (req, res) => {
        const announcements =
            await listAnnouncementsForAdmin();

        return res.status(200).json({
            success: true,
            message:
                "Announcements retrieved successfully.",
            data: announcements,
        });
    }
);

const getMyAnnouncements = asyncHandler(
    async (req, res) => {
        const announcements =
            await listAnnouncementsForCurrentUser({
                role: req.user.role,
                borrowerType:
                    req.user.borrowerType,
            });

        return res.status(200).json({
            success: true,
            message:
                "Announcements retrieved successfully.",
            data: announcements,
        });
    }
);

const updateAnnouncement = asyncHandler(
    async (req, res) => {
        const result = await editAnnouncement({
            announcementId: req.params.id,
            title: req.body.title,
            message: req.body.message,
            audience: req.body.audience,
            status: req.body.status,
        });

        const {
            ipAddress,
            userAgent,
        } = getRequestMetadata(req);

        await recordAuditLog({
            userId: req.user.id,
            action: "UPDATE_ANNOUNCEMENT",
            module: "Announcements",
            entityType: "announcement",
            entityId: req.params.id,
            description:
                `Updated announcement ${req.params.id}. New status: ${req.body.status}.`,
            ipAddress,
            userAgent,
        });

        return res.status(200).json({
            success: true,
            message:
                "Announcement updated successfully.",
            data: result,
        });
    }
);

module.exports = {
    createAnnouncement,
    getAdminAnnouncements,
    getMyAnnouncements,
    updateAnnouncement,
};
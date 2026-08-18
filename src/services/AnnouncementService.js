const {
    createAnnouncement,
    getAllAnnouncements,
    getPublishedAnnouncementsForUser,
    getAnnouncementById,
    updateAnnouncement,
    getTargetUsers,
    createAnnouncementNotifications,
} = require("../repositories/AnnouncementRepository");

const AppError = require("../utils/AppError");

const addAnnouncement = async ({
    title,
    message,
    audience,
    status,
    postedBy,
}) => {
    const announcement = await createAnnouncement({
        title,
        message,
        audience,
        status,
        postedBy,
    });

    let notificationsCreated = 0;

    if (status === "published") {
        const targetUsers =
            await getTargetUsers(audience);

        const userIds = targetUsers.map(
            (user) => user.id
        );

        const notifications =
            await createAnnouncementNotifications({
                userIds,
                announcementId:
                    announcement.id,
                title:
                    "New Library Announcement",
                message: title,
            });

        notificationsCreated =
            notifications.length;
    }

    return {
        announcement,
        notificationsCreated,
    };
};

const listAnnouncementsForAdmin =
    async () => {
        return await getAllAnnouncements();
    };

const listAnnouncementsForCurrentUser =
    async ({
        role,
        borrowerType,
    }) => {
        return await getPublishedAnnouncementsForUser({
            role,
            borrowerType,
        });
    };

const editAnnouncement = async ({
    announcementId,
    title,
    message,
    audience,
    status,
}) => {
    const existingAnnouncement =
        await getAnnouncementById(
            announcementId
        );

    if (!existingAnnouncement) {
        throw new AppError(
            "Announcement not found.",
            404
        );
    }

    const wasPublished =
        existingAnnouncement.status ===
        "published";

    const updatedAnnouncement =
        await updateAnnouncement({
            announcementId,
            title,
            message,
            audience,
            status,
        });

    let notificationsCreated = 0;

    if (
        !wasPublished &&
        status === "published"
    ) {
        const targetUsers =
            await getTargetUsers(
                audience
            );

        const userIds =
            targetUsers.map(
                (user) => user.id
            );

        const notifications =
            await createAnnouncementNotifications({
                userIds,
                announcementId:
                    updatedAnnouncement.id,
                title:
                    "New Library Announcement",
                message:
                    updatedAnnouncement.title,
            });

        notificationsCreated =
            notifications.length;
    }

    return {
        announcement:
            updatedAnnouncement,
        notificationsCreated,
    };
};

module.exports = {
    addAnnouncement,
    listAnnouncementsForAdmin,
    listAnnouncementsForCurrentUser,
    editAnnouncement,
};
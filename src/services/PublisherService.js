const {
    createPublisher,
    getAllPublishers,
    getPublisherById,
    findPublisherByName,
    updatePublisher,
} = require("../repositories/PublisherRepository");

const AppError = require("../utils/AppError");

const addPublisher = async ({
    name,
    address,
    contactEmail,
    contactNumber,
}) => {
    const existingPublisher =
        await findPublisherByName(name);

    if (existingPublisher) {
        throw new AppError(
            "Publisher already exists.",
            409
        );
    }

    return await createPublisher({
        name,
        address,
        contactEmail,
        contactNumber,
    });
};

const listPublishers = async () => {
    return await getAllPublishers();
};

const getPublisherDetails = async (
    publisherId
) => {
    const publisher =
        await getPublisherById(publisherId);

    if (!publisher) {
        throw new AppError(
            "Publisher not found.",
            404
        );
    }

    return publisher;
};

const editPublisher = async ({
    publisherId,
    name,
    address,
    contactEmail,
    contactNumber,
    isActive,
}) => {
    const existingPublisher =
        await getPublisherById(
            publisherId
        );

    if (!existingPublisher) {
        throw new AppError(
            "Publisher not found.",
            404
        );
    }

    const publisherWithSameName =
        await findPublisherByName(name);

    if (
        publisherWithSameName &&
        String(publisherWithSameName.id) !==
            String(publisherId)
    ) {
        throw new AppError(
            "Another publisher with this name already exists.",
            409
        );
    }

    return await updatePublisher({
        publisherId,
        name,
        address,
        contactEmail,
        contactNumber,
        isActive,
    });
};

module.exports = {
    addPublisher,
    listPublishers,
    getPublisherDetails,
    editPublisher,
};
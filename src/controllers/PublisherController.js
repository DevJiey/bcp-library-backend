const {
    addPublisher,
    listPublishers,
    getPublisherDetails,
    editPublisher,
} = require("../services/PublisherService");

const asyncHandler = require("../middlewares/asyncHandler");

const createPublisher = asyncHandler(
    async (req, res) => {
        const publisher = await addPublisher(
            req.body
        );

        return res.status(201).json({
            success: true,
            message:
                "Publisher created successfully.",
            data: publisher,
        });
    }
);

const getPublishers = asyncHandler(
    async (req, res) => {
        const publishers =
            await listPublishers();

        return res.status(200).json({
            success: true,
            message:
                "Publishers retrieved successfully.",
            data: publishers,
        });
    }
);

const getPublisher = asyncHandler(
    async (req, res) => {
        const publisher =
            await getPublisherDetails(
                req.params.id
            );

        return res.status(200).json({
            success: true,
            message:
                "Publisher retrieved successfully.",
            data: publisher,
        });
    }
);

const updatePublisher = asyncHandler(
    async (req, res) => {
        const publisher = await editPublisher({
            publisherId: req.params.id,
            ...req.body,
        });

        return res.status(200).json({
            success: true,
            message:
                "Publisher updated successfully.",
            data: publisher,
        });
    }
);

module.exports = {
    createPublisher,
    getPublishers,
    getPublisher,
    updatePublisher,
};
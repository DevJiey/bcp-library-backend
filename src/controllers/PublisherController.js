const {
    addPublisher,
    listPublishers,
    getPublisherDetails,
    editPublisher,
} = require("../services/PublisherService");

const createPublisher = async (req, res) => {
    try {
        const publisher = await addPublisher(req.body);

        return res.status(201).json({
            success: true,
            message: "Publisher created successfully.",
            data: publisher,
        });
    } catch (error) {
        const statusCode = error.statusCode || 500;

        return res.status(statusCode).json({
            success: false,
            message:
                error.message ||
                "Failed to create publisher.",
        });
    }
};

const getPublishers = async (req, res) => {
    try {
        const publishers = await listPublishers();

        return res.status(200).json({
            success: true,
            message: "Publishers retrieved successfully.",
            data: publishers,
        });
    } catch (error) {
        const statusCode = error.statusCode || 500;

        return res.status(statusCode).json({
            success: false,
            message:
                error.message ||
                "Failed to retrieve publishers.",
        });
    }
};

const getPublisher = async (req, res) => {
    try {
        const publisher = await getPublisherDetails(
            req.params.id
        );

        return res.status(200).json({
            success: true,
            message: "Publisher retrieved successfully.",
            data: publisher,
        });
    } catch (error) {
        const statusCode = error.statusCode || 500;

        return res.status(statusCode).json({
            success: false,
            message:
                error.message ||
                "Failed to retrieve publisher.",
        });
    }
};

const updatePublisher = async (req, res) => {
    try {
        const publisher = await editPublisher({
            publisherId: req.params.id,
            ...req.body,
        });

        return res.status(200).json({
            success: true,
            message: "Publisher updated successfully.",
            data: publisher,
        });
    } catch (error) {
        const statusCode = error.statusCode || 500;

        return res.status(statusCode).json({
            success: false,
            message:
                error.message ||
                "Failed to update publisher.",
        });
    }
};

module.exports = {
    createPublisher,
    getPublishers,
    getPublisher,
    updatePublisher,
};
const AppError = require("./AppError");

const parsePagination = ({
    page = 1,
    limit = 20,
    maxLimit = 100,
}) => {
    const parsedPage = Number(page);
    const parsedLimit = Number(limit);

    if (
        !Number.isInteger(parsedPage) ||
        parsedPage <= 0
    ) {
        throw new AppError(
            "Page must be a positive integer.",
            400
        );
    }

    if (
        !Number.isInteger(parsedLimit) ||
        parsedLimit <= 0 ||
        parsedLimit > maxLimit
    ) {
        throw new AppError(
            `Limit must be between 1 and ${maxLimit}.`,
            400
        );
    }

    return {
        page: parsedPage,
        limit: parsedLimit,
        offset:
            (parsedPage - 1) * parsedLimit,
    };
};

const createPaginationMeta = ({
    page,
    limit,
    total,
}) => {
    return {
        page,
        limit,
        total,
        totalPages:
            Math.ceil(total / limit),
    };
};

module.exports = {
    parsePagination,
    createPaginationMeta,
};
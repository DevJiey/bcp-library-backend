const {
    getLibraryOverview,
    getBorrowingSummary,
    getBorrowRequestSummary,
    getMostBorrowedBooks,
    getOverdueReport,
} = require("../repositories/ReportRepository");

const AppError = require("../utils/AppError");

const getOverviewReport = async () => {
    return await getLibraryOverview();
};

const getBorrowingStatusReport = async () => {
    return await getBorrowingSummary();
};

const getBorrowRequestStatusReport = async () => {
    return await getBorrowRequestSummary();
};

const getPopularBooksReport = async (
    limit = 10
) => {
    const parsedLimit =
        Number(limit);

    if (
        !Number.isInteger(
            parsedLimit
        ) ||
        parsedLimit < 1 ||
        parsedLimit > 100
    ) {
        throw new AppError(
            "Limit must be between 1 and 100.",
            400
        );
    }

    return await getMostBorrowedBooks(
        parsedLimit
    );
};

const getCurrentOverdueReport = async () => {
    return await getOverdueReport();
};

module.exports = {
    getOverviewReport,
    getBorrowingStatusReport,
    getBorrowRequestStatusReport,
    getPopularBooksReport,
    getCurrentOverdueReport,
};
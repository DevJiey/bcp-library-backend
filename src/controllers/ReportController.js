const {
    getOverviewReport,
    getBorrowingStatusReport,
    getBorrowRequestStatusReport,
    getPopularBooksReport,
    getCurrentOverdueReport,
} = require("../services/ReportService");

const asyncHandler = require("../middlewares/asyncHandler");

const getLibraryOverview = asyncHandler(
    async (req, res) => {
        const report = await getOverviewReport();

        return res.status(200).json({
            success: true,
            message:
                "Library overview report retrieved successfully.",
            data: report,
        });
    }
);

const getBorrowingSummary = asyncHandler(
    async (req, res) => {
        const report =
            await getBorrowingStatusReport();

        return res.status(200).json({
            success: true,
            message:
                "Borrowing summary report retrieved successfully.",
            data: report,
        });
    }
);

const getBorrowRequestSummary = asyncHandler(
    async (req, res) => {
        const report =
            await getBorrowRequestStatusReport();

        return res.status(200).json({
            success: true,
            message:
                "Borrow request summary report retrieved successfully.",
            data: report,
        });
    }
);

const getPopularBooks = asyncHandler(
    async (req, res) => {
        const report =
            await getPopularBooksReport(
                req.query.limit || 10
            );

        return res.status(200).json({
            success: true,
            message:
                "Popular books report retrieved successfully.",
            data: report,
        });
    }
);

const getOverdueReport = asyncHandler(
    async (req, res) => {
        const report =
            await getCurrentOverdueReport();

        return res.status(200).json({
            success: true,
            message:
                "Overdue report retrieved successfully.",
            data: report,
        });
    }
);

module.exports = {
    getLibraryOverview,
    getBorrowingSummary,
    getBorrowRequestSummary,
    getPopularBooks,
    getOverdueReport,
};
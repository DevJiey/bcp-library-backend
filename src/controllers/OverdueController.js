const {
    processOverdueBorrowings,
} = require("../services/OverdueService");

const asyncHandler = require("../middlewares/asyncHandler");

const runOverdueCheck = asyncHandler(
    async (req, res) => {
        const results =
            await processOverdueBorrowings();

        return res.status(200).json({
            success: true,
            message:
                "Overdue check completed successfully.",
            data: {
                processedCount: results.length,
                results,
            },
        });
    }
);

module.exports = {
    runOverdueCheck,
};
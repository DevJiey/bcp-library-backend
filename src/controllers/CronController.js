const {
    processOverdueBorrowings,
} = require("../services/OverdueService");

const asyncHandler = require("../middlewares/asyncHandler");

const runOverdueCron = asyncHandler(
    async (req, res) => {
        const authorization =
            req.headers.authorization;

        const cronSecret =
            process.env.CRON_SECRET;

        if (
            !cronSecret ||
            authorization !==
                `Bearer ${cronSecret}`
        ) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized cron request.",
            });
        }

        const results =
            await processOverdueBorrowings();

        return res.status(200).json({
            success: true,
            message:
                "Scheduled overdue check completed successfully.",
            data: {
                processedCount: results.length,
            },
        });
    }
);

module.exports = {
    runOverdueCron,
};
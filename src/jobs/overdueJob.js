const cron = require("node-cron");

const {
    processOverdueBorrowings,
} = require("../services/OverdueService");

const startOverdueJob = () => {
    cron.schedule("*/5 * * * *", async () => {
        try {
            await processOverdueBorrowings();
        } catch (error) {
            console.error(
                "Overdue job failed:",
                error.message
            );
        }
    });
};

module.exports = {
    startOverdueJob,
};
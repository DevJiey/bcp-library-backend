require("dotenv").config();

const app = require("./app");
const pool = require("./config/database");

const {
    startOverdueJob,
} = require("./jobs/overdueJob");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await pool.query("SELECT NOW()");

        startOverdueJob();

        app.listen(PORT, "0.0.0.0", () => {
            console.log(
                `BCP Library API running on port ${PORT}`
            );
        });
    } catch (error) {
        console.error(
            "Failed to connect to PostgreSQL:",
            error.message
        );

        process.exit(1);
    }
};

startServer();
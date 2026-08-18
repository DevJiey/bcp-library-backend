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

        app.listen(PORT, () => {
            console.log(
                `BCP Library API running on http://localhost:${PORT}`
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
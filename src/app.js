const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./docs/swagger");
const errorHandler = require("./middlewares/errorHandler");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const publisherRoutes = require("./routes/publisherRoutes");
const authorRoutes = require("./routes/authorRoutes");
const bookRoutes = require("./routes/bookRoutes");
const bookCopyRoutes = require("./routes/bookCopyRoutes");
const borrowRequestRoutes = require("./routes/borrowRequestRoutes");
const staffBorrowRequestRoutes = require("./routes/staffBorrowRequestRoutes");
const borrowTransactionRoutes = require("./routes/borrowTransactionRoutes");
const returnRoutes = require("./routes/returnRoutes");
const overdueRoutes = require("./routes/overdueRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const announcementRoutes = require("./routes/announcementRoutes");
const auditLogRoutes = require("./routes/auditLogRoutes");
const reportRoutes = require("./routes/reportRoutes");
const librarySettingRoutes = require("./routes/librarySettingRoutes");
const backupRoutes = require("./routes/backupRoutes");

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use("/api/v1", userRoutes);
app.use("/api/v1", categoryRoutes);
app.use("/api/v1", publisherRoutes);
app.use("/api/v1", authorRoutes);
app.use("/api/v1", bookRoutes);
app.use("/api/v1", bookCopyRoutes);
app.use("/api/v1", borrowRequestRoutes);
app.use("/api/v1", staffBorrowRequestRoutes);
app.use("/api/v1", borrowTransactionRoutes);
app.use("/api/v1", returnRoutes);
app.use("/api/v1", overdueRoutes);
app.use("/api/v1", notificationRoutes);
app.use("/api/v1", announcementRoutes);
app.use("/api/v1", auditLogRoutes);
app.use("/api/v1", reportRoutes);
app.use("/api/v1", librarySettingRoutes);
app.use("/api/v1", backupRoutes);
app.use(errorHandler);
app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec)
);

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Check API health
 *     description: Checks if the BCP Library backend API is running.
 *     tags:
 *       - Health
 *     responses:
 *       200:
 *         description: API is running successfully.
 */
app.get("/api/v1/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "BCP Library API is running.",
        version: "1.0.0",
    });
});

app.use("/api/v1", authRoutes);

module.exports = app;
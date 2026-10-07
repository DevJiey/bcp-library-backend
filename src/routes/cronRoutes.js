const express = require("express");

const {
    runOverdueCron,
} = require("../controllers/CronController");

const router = express.Router();

/**
 * Internal scheduled task endpoint.
 *
 * Authentication is handled inside CronController
 * using the CRON_SECRET environment variable.
 */
router.get(
    "/internal/cron/overdue",
    runOverdueCron
);

module.exports = router;
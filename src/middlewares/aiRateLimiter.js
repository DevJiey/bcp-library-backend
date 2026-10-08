
const { rateLimit } = require("express-rate-limit");

const aiRateLimiter = rateLimit({
    windowMs: 60 * 1000,

    limit: 5,

    standardHeaders: "draft-8",

    legacyHeaders: false,

    message: {
        success: false,
        message:
            "Too many AI requests. Please try again in a minute.",
    },
});

module.exports = aiRateLimiter;

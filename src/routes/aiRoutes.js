
const express = require("express");

const authenticate = require("../middlewares/authenticate");
const aiRateLimiter = require("../middlewares/aiRateLimiter");
const { chatWithAI } = require("../controllers/AIController");

const router = express.Router();

// Require login and limit AI requests.
router.post(
    "/ai/chat",
    authenticate,
    aiRateLimiter,
    chatWithAI
);

module.exports = router;

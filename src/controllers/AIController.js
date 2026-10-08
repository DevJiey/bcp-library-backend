
const {
    generateAIResponse,
} = require("../services/AIService");

const {
    reserveAIQuota,
} = require("../services/AIQuotaService");

const chatWithAI = async (req, res, next) => {
    try {
        const { message } = req.body || {};

        // Validate the user's message first.
        if (
            typeof message !== "string" ||
            !message.trim() ||
            message.length > 1000
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Message must contain 1 to 1000 characters.",
            });
        }

        // The authenticate middleware supplies req.user.
        if (!req.user?.id) {
            return res.status(401).json({
                success: false,
                message: "Authentication required.",
            });
        }

        // Reserve quota BEFORE calling Gemini.
        const quota = await reserveAIQuota(req.user.id);

        if (!quota.allowed) {
            return res.status(quota.status).json({
                success: false,
                message: quota.message,
            });
        }

        const reply = await generateAIResponse(
            message.trim()
        );

        return res.status(200).json({
            success: true,
            data: {
                reply,
                remainingDailyMessages: quota.remaining,
            },
        });
    } catch (error) {
        console.error(
            "AI chat request failed:",
            error.message
        );

        next(error);
    }
};

module.exports = {
    chatWithAI,
};

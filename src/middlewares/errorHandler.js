
const errorHandler = (
    error,
    req,
    res,
    next
) => {
    const statusCode =
        Number.isInteger(error.statusCode) &&
        error.statusCode >= 400 &&
        error.statusCode <= 599
            ? error.statusCode
            : 500;

    const isProduction =
        process.env.NODE_ENV === "production";

    // Only allow explicitly approved messages
    // for AI provider errors.
    const safeAIMessages = {
        502:
            "AI assistant could not process your request. " +
            "Please try again later.",

        503:
            "AI assistant is temporarily unavailable. " +
            "Please try again later.",

        504:
            "AI assistant took too long to respond. " +
            "Please try again.",
    };

    const isAIChatRequest =
        req.originalUrl?.split("?")[0] ===
        "/api/v1/ai/chat";

    if (process.env.NODE_ENV !== "test") {
        console.error(
            `[${req.method}] ${req.originalUrl}`,
            {
                statusCode,
                message: error.message,
                stack: error.stack,
            }
        );
    }

    let message =
        error.message ||
        "Internal server error.";

    if (isProduction && statusCode >= 500) {
        // Never expose raw server or database errors.
        message = "Internal server error.";

        // Show approved generic messages only
        // for errors explicitly marked as safe.
        if (
            isAIChatRequest &&
            error.isSafeAIError === true &&
            safeAIMessages[statusCode]
        ) {
            message = safeAIMessages[statusCode];
        }
    }

    return res.status(statusCode).json({
        success: false,
        message,
    });
};

module.exports = errorHandler;

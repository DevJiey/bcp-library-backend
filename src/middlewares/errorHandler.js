const errorHandler = (
    error,
    req,
    res,
    next
) => {
    const statusCode =
        error.statusCode || 500;

    const isProduction =
        process.env.NODE_ENV === "production";

    /*
     * Log the complete error on the server.
     *
     * This allows us to inspect the real error
     * through local logs or Vercel logs without
     * exposing internal details to the client.
     */
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

    /*
     * In production, unexpected server errors
     * should not expose database errors,
     * stack traces, paths, or other internal
     * implementation details.
     *
     * Expected application errors may still
     * return their normal message.
     */
    const message =
        isProduction && statusCode >= 500
            ? "Internal server error."
            : error.message ||
              "Internal server error.";

    return res.status(statusCode).json({
        success: false,
        message,
    });
};

module.exports = errorHandler;
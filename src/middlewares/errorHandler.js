const errorHandler = (
    error,
    req,
    res,
    next
) => {
    const statusCode =
        error.statusCode || 500;

    const message =
        error.message ||
        "Internal server error.";

    if (process.env.NODE_ENV !== "test") {
        console.error(
            `[${req.method}] ${req.originalUrl}`,
            error
        );
    }

    return res.status(statusCode).json({
        success: false,
        message,
    });
};

module.exports = errorHandler;
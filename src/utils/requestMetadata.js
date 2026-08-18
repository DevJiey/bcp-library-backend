const getRequestMetadata = (req) => {
    const forwardedFor = req.headers["x-forwarded-for"];

    let ipAddress = null;

    if (forwardedFor) {
        ipAddress = forwardedFor
            .split(",")[0]
            .trim();
    } else {
        ipAddress =
            req.ip ||
            req.socket?.remoteAddress ||
            null;
    }

    const userAgent =
        req.headers["user-agent"] || null;

    return {
        ipAddress,
        userAgent,
    };
};

module.exports = {
    getRequestMetadata,
};

const { Redis } = require("@upstash/redis");
const { Ratelimit } = require("@upstash/ratelimit");

const isProduction = process.env.NODE_ENV === "production";

const hasRedisConfig = Boolean(
    process.env.UPSTASH_REDIS_REST_URL &&
    process.env.UPSTASH_REDIS_REST_TOKEN
);

if (isProduction && !hasRedisConfig) {
    throw new Error(
        "Redis configuration is required in production. Set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN."
    );
}

const redis = hasRedisConfig
    ? new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
    : null;

const verificationLimiter = redis
    ? new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(20, "15 m"),
        prefix: "bcp-library:invitation:verify",
        analytics: false,
    })
    : null;

const acceptanceLimiter = redis
    ? new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(10, "15 m"),
        prefix: "bcp-library:invitation:accept",
        analytics: false,
    })
    : null;

function createMiddleware(limiter, errorMessage) {
    return async (req, res, next) => {
        if (!limiter) {
            return next();
        }

        try {
            const ip = String(
                req.ip || req.socket.remoteAddress || "unknown"
            ).trim();

            const result = await limiter.limit(ip);

            res.setHeader("RateLimit-Limit", String(result.limit));
            res.setHeader(
                "RateLimit-Remaining",
                String(result.remaining)
            );

            if (!result.success) {
                return res.status(429).json({
                    success: false,
                    message: errorMessage,
                });
            }

            return next();
        } catch (error) {
            console.error("Invitation rate limit error:", error);

            if (isProduction) {
                return res.status(503).json({
                    success: false,
                    message:
                        "Account invitation service is temporarily unavailable. Please try again later.",
                });
            }

            return next();
        }
    };
}

const invitationVerificationLimiter = createMiddleware(
    verificationLimiter,
    "Too many invitation verification attempts. Please try again in 15 minutes."
);

const invitationAcceptanceLimiter = createMiddleware(
    acceptanceLimiter,
    "Too many account setup attempts. Please try again in 15 minutes."
);

module.exports = {
    invitationVerificationLimiter,
    invitationAcceptanceLimiter,
};

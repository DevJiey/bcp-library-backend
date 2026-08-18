const {
    listAuditLogs,
} = require("../services/AuditLogService");

const asyncHandler = require("../middlewares/asyncHandler");

const getAuditLogs = asyncHandler(
    async (req, res) => {
        const result = await listAuditLogs({
            userId: req.query.userId,
            action: req.query.action,
            module: req.query.module,
            entityType: req.query.entityType,
            page: req.query.page,
            limit: req.query.limit,
        });

        return res.status(200).json({
            success: true,
            message: "Audit logs retrieved successfully.",
            data: result,
        });
    }
);

module.exports = {
    getAuditLogs,
};
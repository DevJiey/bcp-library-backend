const {
    processReturn,
} = require("../services/ReturnService");

const {
    recordAuditLog,
} = require("../services/AuditLogService");

const {
    getRequestMetadata,
} = require("../utils/requestMetadata");

const asyncHandler = require("../middlewares/asyncHandler");

const processBookReturn = asyncHandler(
    async (req, res) => {
        const result = await processReturn({
            barcode: req.body.barcode,
            staffId: req.user.id,
            conditionOnReturn:
                req.body.conditionOnReturn,
            remarks: req.body.remarks,
        });

        const {
            ipAddress,
            userAgent,
        } = getRequestMetadata(req);

        await recordAuditLog({
            userId: req.user.id,
            action: "PROCESS_RETURN",
            module: "Returns",
            entityType: "borrow_transaction",
            entityId:
                result.returnRecord
                    .borrow_transaction_id,
            description:
                `Processed return for barcode ${req.body.barcode} with condition ${req.body.conditionOnReturn}.`,
            ipAddress,
            userAgent,
        });

        return res.status(200).json({
            success: true,
            message:
                "Book return processed successfully.",
            data: result,
        });
    }
);

module.exports = {
    processBookReturn,
};
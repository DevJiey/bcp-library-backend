const {
    listPendingRequests,
    approveRequest,
    rejectRequest,
} = require("../services/StaffBorrowRequestService");

const {
    recordAuditLog,
} = require("../services/AuditLogService");

const {
    getRequestMetadata,
} = require("../utils/requestMetadata");

const asyncHandler = require("../middlewares/asyncHandler");

const getPendingRequests = asyncHandler(
    async (req, res) => {
        const requests =
            await listPendingRequests();

        return res.status(200).json({
            success: true,
            message:
                "Pending borrow requests retrieved successfully.",
            data: requests,
        });
    }
);

const approveBorrowRequest = asyncHandler(
    async (req, res) => {
        const transaction =
            await approveRequest({
                requestId: req.params.id,
                barcode: req.body.barcode,
                staffId: req.user.id,
            });

        const {
            ipAddress,
            userAgent,
        } = getRequestMetadata(req);

        await recordAuditLog({
            userId: req.user.id,
            action: "APPROVE_BORROW_REQUEST",
            module: "Borrowing",
            entityType: "borrow_request",
            entityId: req.params.id,
            description:
                `Approved borrow request ${req.params.id} using book barcode ${req.body.barcode}.`,
            ipAddress,
            userAgent,
        });

        return res.status(200).json({
            success: true,
            message:
                "Borrow request approved successfully.",
            data: transaction,
        });
    }
);

const rejectBorrowRequest = asyncHandler(
    async (req, res) => {
        const request =
            await rejectRequest({
                requestId: req.params.id,
                rejectionReason:
                    req.body.rejectionReason,
                staffId: req.user.id,
            });

        const {
            ipAddress,
            userAgent,
        } = getRequestMetadata(req);

        await recordAuditLog({
            userId: req.user.id,
            action: "REJECT_BORROW_REQUEST",
            module: "Borrowing",
            entityType: "borrow_request",
            entityId: req.params.id,
            description:
                `Rejected borrow request ${req.params.id}. Reason: ${req.body.rejectionReason}`,
            ipAddress,
            userAgent,
        });

        return res.status(200).json({
            success: true,
            message:
                "Borrow request rejected successfully.",
            data: request,
        });
    }
);

module.exports = {
    getPendingRequests,
    approveBorrowRequest,
    rejectBorrowRequest,
};
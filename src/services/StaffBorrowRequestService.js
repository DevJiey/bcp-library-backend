const {
    getPendingBorrowRequests,
    getBorrowRequestById,
    getBookCopyByBarcode,
    getBorrowingPeriodDays,
    approveBorrowRequest,
    rejectBorrowRequest,
} = require("../repositories/StaffBorrowRequestRepository");

const {
    createNotification,
} = require("../repositories/NotificationRepository");

const {
    calculateDueDate,
} = require("../utils/dateTime");

const AppError = require("../utils/AppError");

const listPendingRequests = async () => {
    return await getPendingBorrowRequests();
};

const approveRequest = async ({
    requestId,
    barcode,
    staffId,
}) => {
    const request =
        await getBorrowRequestById(
            requestId
        );

    if (!request) {
        throw new AppError(
            "Borrow request not found.",
            404
        );
    }

    if (request.status !== "pending") {
        throw new AppError(
            "Only pending borrow requests can be approved.",
            409
        );
    }

    if (
        request.account_status !==
        "active"
    ) {
        throw new AppError(
            "Borrower account is not active.",
            403
        );
    }

    const copy =
        await getBookCopyByBarcode(
            barcode
        );

    if (!copy) {
        throw new AppError(
            "No book copy found with this barcode.",
            404
        );
    }

    if (
        String(copy.book_id) !==
        String(request.book_id)
    ) {
        throw new AppError(
            "The scanned book copy does not belong to the requested book.",
            400
        );
    }

    if (
        copy.status !== "available"
    ) {
        throw new AppError(
            "The selected book copy is not available.",
            409
        );
    }

    if (
        copy.condition === "damaged" ||
        copy.condition === "lost"
    ) {
        throw new AppError(
            "The selected book copy cannot be borrowed because of its condition.",
            409
        );
    }

    const periodSetting =
        await getBorrowingPeriodDays();

    if (!periodSetting) {
        throw new AppError(
            "Borrowing period setting is missing.",
            500
        );
    }

    const borrowingPeriodDays =
        Number(
            periodSetting.setting_value
        );

    if (
        !Number.isInteger(
            borrowingPeriodDays
        ) ||
        borrowingPeriodDays <= 0
    ) {
        throw new AppError(
            "Borrowing period setting is invalid.",
            500
        );
    }

    const dueAt =
        calculateDueDate(
            borrowingPeriodDays
        );

    const transaction =
        await approveBorrowRequest({
            requestId: request.id,
            borrowerId:
                request.borrower_id,
            bookCopyId: copy.id,
            staffId,
            dueAt,
        });

    /*
     * Notification is created after the
     * borrowing transaction succeeds.
     *
     * Notification failure should not undo
     * an already successful borrowing.
     */
    try {
        await createNotification({
            userId:
                request.borrower_id,

            type:
                "borrow_request_approved",

            title:
                "Borrow Request Approved",

            message:
                `Your request for "${request.title}" has been approved. Due date: ${new Date(
                    dueAt
                ).toLocaleDateString(
                    "en-US",
                    {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                    }
                )}.`,

            relatedEntityType:
                "borrow_request",

            relatedEntityId:
                request.id,
        });
    } catch (error) {
        console.error(
            "Failed to create approval notification:",
            error.message
        );
    }

    return transaction;
};

const rejectRequest = async ({
    requestId,
    rejectionReason,
    staffId,
}) => {
    const request =
        await getBorrowRequestById(
            requestId
        );

    if (!request) {
        throw new AppError(
            "Borrow request not found.",
            404
        );
    }

    if (
        request.status !== "pending"
    ) {
        throw new AppError(
            "Only pending borrow requests can be rejected.",
            409
        );
    }

    const rejectedRequest =
        await rejectBorrowRequest({
            requestId,
            staffId,
            rejectionReason,
        });

    /*
     * Create borrower notification
     * after successful rejection.
     */
    try {
        await createNotification({
            userId:
                request.borrower_id,

            type:
                "borrow_request_rejected",

            title:
                "Borrow Request Rejected",

            message:
                `Your request for "${request.title}" was rejected. Reason: ${rejectionReason}`,

            relatedEntityType:
                "borrow_request",

            relatedEntityId:
                request.id,
        });
    } catch (error) {
        console.error(
            "Failed to create rejection notification:",
            error.message
        );
    }

    return rejectedRequest;
};

module.exports = {
    listPendingRequests,
    approveRequest,
    rejectRequest,
};
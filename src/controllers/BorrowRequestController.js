const {
    submitBorrowRequest,
    listMyBorrowRequests,
} = require("../services/BorrowRequestService");

const asyncHandler = require("../middlewares/asyncHandler");

const createBorrowRequest = asyncHandler(
    async (req, res) => {
        const request =
            await submitBorrowRequest({
                borrowerId: req.user.id,
                bookId: req.body.bookId,
            });

        return res.status(201).json({
            success: true,
            message:
                "Borrow request submitted successfully.",
            data: request,
        });
    }
);

const getMyBorrowRequests = asyncHandler(
    async (req, res) => {
        const requests =
            await listMyBorrowRequests(
                req.user.id
            );

        return res.status(200).json({
            success: true,
            message:
                "Borrow requests retrieved successfully.",
            data: requests,
        });
    }
);

module.exports = {
    createBorrowRequest,
    getMyBorrowRequests,
};
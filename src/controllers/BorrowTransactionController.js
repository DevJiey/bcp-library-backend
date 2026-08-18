const {
    listMyBorrowings,
    listMyActiveBorrowings,
} = require("../services/BorrowTransactionService");

const asyncHandler = require("../middlewares/asyncHandler");

const getMyBorrowings = asyncHandler(
    async (req, res) => {
        const borrowings =
            await listMyBorrowings(
                req.user.id
            );

        return res.status(200).json({
            success: true,
            message:
                "Borrowing history retrieved successfully.",
            data: borrowings,
        });
    }
);

const getMyActiveBorrowings = asyncHandler(
    async (req, res) => {
        const borrowings =
            await listMyActiveBorrowings(
                req.user.id
            );

        return res.status(200).json({
            success: true,
            message:
                "Active borrowings retrieved successfully.",
            data: borrowings,
        });
    }
);

module.exports = {
    getMyBorrowings,
    getMyActiveBorrowings,
};
const {
    findActiveBorrowingByBarcode,
    processReturnTransaction,
} = require("../repositories/ReturnRepository");

const {
    unlockBorrowerIfCleared,
} = require("./OverdueService");

const AppError = require("../utils/AppError");

const processReturn = async ({
    barcode,
    staffId,
    conditionOnReturn,
    remarks,
}) => {
    const borrowing =
        await findActiveBorrowingByBarcode(
            barcode
        );

    if (!borrowing) {
        throw new AppError(
            "No active borrowing found for this barcode.",
            404
        );
    }

    const wasOverdue =
        borrowing.status === "overdue";

    const returnRecord =
        await processReturnTransaction({
            borrowTransactionId:
                borrowing.borrow_transaction_id,
            bookCopyId:
                borrowing.book_copy_id,
            staffId,
            conditionOnReturn,
            remarks,
        });

    let accountUpdate = null;

    if (wasOverdue) {
        accountUpdate =
            await unlockBorrowerIfCleared(
                borrowing.borrower_id
            );
    }

    return {
        returnRecord,
        accountUpdate,
    };
};

module.exports = {
    processReturn,
};
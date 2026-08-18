const {
    getBorrowerById,
    getBookById,
    countAvailableCopies,
    findPendingRequest,
    countActiveBorrowings,
    getLibrarySetting,
    createBorrowRequest,
    getBorrowRequestsByBorrower,
} = require("../repositories/BorrowRequestRepository");

const AppError = require("../utils/AppError");

const submitBorrowRequest = async ({
    borrowerId,
    bookId,
}) => {
    const borrower =
        await getBorrowerById(
            borrowerId
        );

    if (!borrower) {
        throw new AppError(
            "Borrower account not found.",
            404
        );
    }

    if (borrower.role !== "borrower") {
        throw new AppError(
            "Only borrower accounts can submit borrow requests.",
            403
        );
    }

    if (
        borrower.account_status === "locked"
    ) {
        throw new AppError(
            "Your account is locked due to an overdue borrowing.",
            403
        );
    }

    if (
        borrower.account_status !== "active"
    ) {
        throw new AppError(
            "Your account is not allowed to submit borrow requests.",
            403
        );
    }

    const book =
        await getBookById(bookId);

    if (!book) {
        throw new AppError(
            "Book not found.",
            404
        );
    }

    if (!book.is_active) {
        throw new AppError(
            "This book is currently unavailable.",
            400
        );
    }

    const availableCopies =
        await countAvailableCopies(
            bookId
        );

    if (availableCopies <= 0) {
        throw new AppError(
            "No available copy of this book.",
            409
        );
    }

    const existingPendingRequest =
        await findPendingRequest({
            borrowerId,
            bookId,
        });

    if (existingPendingRequest) {
        throw new AppError(
            "You already have a pending request for this book.",
            409
        );
    }

    const activeBorrowings =
        await countActiveBorrowings(
            borrowerId
        );

    let settingKey;

    if (
        borrower.borrower_type ===
        "student"
    ) {
        settingKey =
            "student_borrow_limit";
    } else if (
        borrower.borrower_type ===
        "faculty"
    ) {
        settingKey =
            "faculty_borrow_limit";
    } else {
        throw new AppError(
            "Borrower type is invalid.",
            400
        );
    }

    const setting =
        await getLibrarySetting(
            settingKey
        );

    if (!setting) {
        throw new AppError(
            "Borrowing limit setting is missing.",
            500
        );
    }

    const borrowLimit =
        Number(setting.setting_value);

    if (
        !Number.isInteger(
            borrowLimit
        ) ||
        borrowLimit <= 0
    ) {
        throw new AppError(
            "Borrowing limit setting is invalid.",
            500
        );
    }

    if (
        activeBorrowings >=
        borrowLimit
    ) {
        throw new AppError(
            `You have reached your borrowing limit of ${borrowLimit} books.`,
            409
        );
    }

    return await createBorrowRequest({
        borrowerId,
        bookId,
    });
};

const listMyBorrowRequests = async (
    borrowerId
) => {
    const borrower =
        await getBorrowerById(
            borrowerId
        );

    if (!borrower) {
        throw new AppError(
            "Borrower account not found.",
            404
        );
    }

    if (
        borrower.role !== "borrower"
    ) {
        throw new AppError(
            "Only borrower accounts can access borrow requests.",
            403
        );
    }

    return await getBorrowRequestsByBorrower(
        borrowerId
    );
};

module.exports = {
    submitBorrowRequest,
    listMyBorrowRequests,
};
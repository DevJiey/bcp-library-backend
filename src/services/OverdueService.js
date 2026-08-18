const {
    getOverdueBorrowings,
    markBorrowingOverdue,
    lockBorrowerAccount,
    countOverdueBorrowings,
    unlockBorrowerAccount,
    createNotification,
} = require("../repositories/OverdueRepository");

const processOverdueBorrowings = async () => {
    const overdueBorrowings =
        await getOverdueBorrowings();

    const results = [];

    for (const borrowing of overdueBorrowings) {
        const updatedTransaction =
            await markBorrowingOverdue(
                borrowing.id
            );

        if (!updatedTransaction) {
            continue;
        }

        const lockedAccount =
            await lockBorrowerAccount(
                borrowing.borrower_id
            );

        await createNotification({
            userId: borrowing.borrower_id,
            type: "overdue_warning",
            title: "Overdue Book",
            message:
                `Your borrowed book "${borrowing.title}" is overdue. ` +
                "Your borrowing account has been temporarily locked until all overdue books are returned.",
            relatedEntityType: "borrow_transaction",
            relatedEntityId: borrowing.id,
        });

        results.push({
            transaction: updatedTransaction,
            accountLocked: Boolean(lockedAccount),
        });
    }

    return results;
};

const unlockBorrowerIfCleared = async (
    borrowerId
) => {
    const overdueCount =
        await countOverdueBorrowings(
            borrowerId
        );

    if (overdueCount > 0) {
        return {
            unlocked: false,
            remainingOverdue: overdueCount,
        };
    }

    const unlockedAccount =
        await unlockBorrowerAccount(
            borrowerId
        );

    if (unlockedAccount) {
        await createNotification({
            userId: borrowerId,
            type: "account_unlocked",
            title: "Borrowing Account Unlocked",
            message:
                "All overdue books have been cleared. You may submit borrow requests again.",
            relatedEntityType: "user",
            relatedEntityId: borrowerId,
        });
    }

    return {
        unlocked: Boolean(unlockedAccount),
        remainingOverdue: 0,
    };
};

module.exports = {
    processOverdueBorrowings,
    unlockBorrowerIfCleared,
};
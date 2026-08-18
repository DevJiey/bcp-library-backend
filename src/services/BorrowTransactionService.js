const {
    getBorrowTransactionsByBorrower,
    getActiveBorrowTransactionsByBorrower,
} = require("../repositories/BorrowTransactionRepository");

const listMyBorrowings = async (borrowerId) => {
    return await getBorrowTransactionsByBorrower(
        borrowerId
    );
};

const listMyActiveBorrowings = async (borrowerId) => {
    return await getActiveBorrowTransactionsByBorrower(
        borrowerId
    );
};

module.exports = {
    listMyBorrowings,
    listMyActiveBorrowings,
};
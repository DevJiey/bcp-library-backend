const {
    getBookById,
    findCopyByAccessionNumber,
    findCopyByBarcode,
    createBookCopy,
    getAllBookCopies,
    getCopiesByBookId,
    getBookCopyById,
    findBookCopyByBarcode,
} = require("../repositories/BookCopyRepository");

const AppError = require("../utils/AppError");

const addBookCopy = async ({
    bookId,
    accessionNumber,
    barcode,
    shelfLocation,
    condition,
    acquiredAt,
}) => {
    const book = await getBookById(bookId);

    if (!book) {
        throw new AppError(
            "Book not found.",
            404
        );
    }

    if (!book.is_active) {
        throw new AppError(
            "Cannot add a copy to an inactive book.",
            400
        );
    }

    const existingAccessionNumber =
        await findCopyByAccessionNumber(
            accessionNumber
        );

    if (existingAccessionNumber) {
        throw new AppError(
            "Accession number already exists.",
            409
        );
    }

    const existingBarcode =
        await findCopyByBarcode(barcode);

    if (existingBarcode) {
        throw new AppError(
            "Barcode already exists.",
            409
        );
    }

    return await createBookCopy({
        bookId,
        accessionNumber,
        barcode,
        shelfLocation,
        condition,
        acquiredAt,
    });
};

const listBookCopies = async () => {
    return await getAllBookCopies();
};

const listCopiesByBook = async (
    bookId
) => {
    const book =
        await getBookById(bookId);

    if (!book) {
        throw new AppError(
            "Book not found.",
            404
        );
    }

    return await getCopiesByBookId(
        bookId
    );
};

const getBookCopyDetails = async (
    copyId
) => {
    const copy =
        await getBookCopyById(copyId);

    if (!copy) {
        throw new AppError(
            "Book copy not found.",
            404
        );
    }

    return copy;
};

const getBookCopyByBarcode = async (
    barcode
) => {
    const copy =
        await findBookCopyByBarcode(
            barcode
        );

    if (!copy) {
        throw new AppError(
            "No book copy found with this barcode.",
            404
        );
    }

    return copy;
};

module.exports = {
    addBookCopy,
    listBookCopies,
    listCopiesByBook,
    getBookCopyDetails,
    getBookCopyByBarcode,
};
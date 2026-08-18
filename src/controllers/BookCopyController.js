const {
    addBookCopy,
    listBookCopies,
    listCopiesByBook,
    getBookCopyDetails,
    getBookCopyByBarcode,
} = require("../services/BookCopyService");

const asyncHandler = require("../middlewares/asyncHandler");

const createBookCopy = asyncHandler(
    async (req, res) => {
        const copy = await addBookCopy(
            req.body
        );

        return res.status(201).json({
            success: true,
            message:
                "Book copy created successfully.",
            data: copy,
        });
    }
);

const getBookCopies = asyncHandler(
    async (req, res) => {
        const copies =
            await listBookCopies();

        return res.status(200).json({
            success: true,
            message:
                "Book copies retrieved successfully.",
            data: copies,
        });
    }
);

const getCopiesByBook = asyncHandler(
    async (req, res) => {
        const copies =
            await listCopiesByBook(
                req.params.bookId
            );

        return res.status(200).json({
            success: true,
            message:
                "Book copies retrieved successfully.",
            data: copies,
        });
    }
);

const getBookCopy = asyncHandler(
    async (req, res) => {
        const copy =
            await getBookCopyDetails(
                req.params.id
            );

        return res.status(200).json({
            success: true,
            message:
                "Book copy retrieved successfully.",
            data: copy,
        });
    }
);

const getCopyByBarcode = asyncHandler(
    async (req, res) => {
        const copy =
            await getBookCopyByBarcode(
                req.params.barcode
            );

        return res.status(200).json({
            success: true,
            message:
                "Book copy retrieved successfully.",
            data: copy,
        });
    }
);

module.exports = {
    createBookCopy,
    getBookCopies,
    getCopiesByBook,
    getBookCopy,
    getCopyByBarcode,
};
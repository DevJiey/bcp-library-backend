const {
    addBook,
    listBooks,
    getBookDetails,
    searchBookCatalog,
} = require("../services/BookService");

const {
    recordAuditLog,
} = require("../services/AuditLogService");

const {
    getRequestMetadata,
} = require("../utils/requestMetadata");

const asyncHandler = require("../middlewares/asyncHandler");

const createBook = asyncHandler(
    async (req, res) => {
        const book = await addBook(req.body);

        const {
            ipAddress,
            userAgent,
        } = getRequestMetadata(req);

        await recordAuditLog({
            userId: req.user.id,
            action: "CREATE_BOOK",
            module: "Catalog",
            entityType: "book",
            entityId: book.id,
            description:
                `Created book "${book.title}" with ISBN ${book.isbn || "N/A"}.`,
            ipAddress,
            userAgent,
        });

        return res.status(201).json({
            success: true,
            message: "Book created successfully.",
            data: book,
        });
    }
);

const getBooks = asyncHandler(
    async (req, res) => {
        const books = await listBooks();

        return res.status(200).json({
            success: true,
            message:
                "Books retrieved successfully.",
            data: books,
        });
    }
);

const getBook = asyncHandler(
    async (req, res) => {
        const book = await getBookDetails(
            req.params.id
        );

        return res.status(200).json({
            success: true,
            message:
                "Book retrieved successfully.",
            data: book,
        });
    }
);

const searchBooks = asyncHandler(
    async (req, res) => {
        const books =
            await searchBookCatalog({
                search: req.query.search,
                categoryId:
                    req.query.categoryId,
            });

        return res.status(200).json({
            success: true,
            message:
                "Book catalog search completed successfully.",
            data: books,
        });
    }
);

module.exports = {
    createBook,
    getBooks,
    getBook,
    searchBooks,
};
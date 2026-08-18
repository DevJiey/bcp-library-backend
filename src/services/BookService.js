const {
    findBookByISBN,
    getCategoryById,
    getPublisherById,
    getAuthorsByIds,
    createBook,
    addBookAuthors,
    getAllBooks,
    getBookById,
    searchBooks,
} = require("../repositories/BookRepository");

const AppError = require("../utils/AppError");

const addBook = async ({
    isbn,
    title,
    categoryId,
    publisherId,
    publicationYear,
    edition,
    description,
    coverImageUrl,
    authorIds,
}) => {
    if (isbn) {
        const existingBook =
            await findBookByISBN(isbn);

        if (existingBook) {
            throw new AppError(
                "A book with this ISBN already exists.",
                409
            );
        }
    }

    if (categoryId) {
        const category =
            await getCategoryById(categoryId);

        if (!category) {
            throw new AppError(
                "Category not found.",
                404
            );
        }

        if (!category.is_active) {
            throw new AppError(
                "The selected category is inactive.",
                400
            );
        }
    }

    if (publisherId) {
        const publisher =
            await getPublisherById(publisherId);

        if (!publisher) {
            throw new AppError(
                "Publisher not found.",
                404
            );
        }

        if (!publisher.is_active) {
            throw new AppError(
                "The selected publisher is inactive.",
                400
            );
        }
    }

    if (
        authorIds &&
        authorIds.length > 0
    ) {
        const uniqueAuthorIds = [
            ...new Set(
                authorIds.map(String)
            ),
        ];

        if (
            uniqueAuthorIds.length !==
            authorIds.length
        ) {
            throw new AppError(
                "Duplicate author IDs are not allowed.",
                400
            );
        }

        const authors =
            await getAuthorsByIds(
                authorIds
            );

        if (
            authors.length !==
            authorIds.length
        ) {
            throw new AppError(
                "One or more selected authors do not exist.",
                404
            );
        }

        const inactiveAuthor =
            authors.find(
                (author) =>
                    !author.is_active
            );

        if (inactiveAuthor) {
            throw new AppError(
                "One or more selected authors are inactive.",
                400
            );
        }
    }

    const book = await createBook({
        isbn,
        title,
        categoryId,
        publisherId,
        publicationYear,
        edition,
        description,
        coverImageUrl,
    });

    if (
        authorIds &&
        authorIds.length > 0
    ) {
        await addBookAuthors({
            bookId: book.id,
            authorIds,
        });
    }

    return await getBookById(
        book.id
    );
};

const listBooks = async () => {
    return await getAllBooks();
};

const getBookDetails = async (
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

    return book;
};

const searchBookCatalog = async ({
    search,
    categoryId,
}) => {
    let parsedCategoryId = null;

    if (
        categoryId !== undefined &&
        categoryId !== null &&
        categoryId !== ""
    ) {
        parsedCategoryId =
            Number(categoryId);

        if (
            !Number.isInteger(
                parsedCategoryId
            ) ||
            parsedCategoryId <= 0
        ) {
            throw new AppError(
                "Category ID must be a valid positive integer.",
                400
            );
        }
    }

    const normalizedSearch =
        typeof search === "string"
            ? search.trim()
            : "";

    return await searchBooks({
        search:
            normalizedSearch || null,
        categoryId:
            parsedCategoryId,
    });
};

module.exports = {
    addBook,
    listBooks,
    getBookDetails,
    searchBookCatalog,
};
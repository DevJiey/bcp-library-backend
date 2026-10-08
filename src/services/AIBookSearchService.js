
const {
    searchBooks,
} = require("../repositories/BookRepository");

const searchLibraryBooks = async (keyword) => {
    if (
        typeof keyword !== "string" ||
        !keyword.trim()
    ) {
        return [];
    }

    const books = await searchBooks({
        search: keyword.trim().slice(0, 100),
    });

    return books.slice(0, 10).map((book) => ({
        id: book.id,
        title: book.title,
        isbn: book.isbn,
        category: book.category_name,
        authors: book.authors,
        description: book.description,
        totalCopies: Number(book.total_copies),
        availableCopies: Number(book.available_copies),
    }));
};

module.exports = {
    searchLibraryBooks,
};

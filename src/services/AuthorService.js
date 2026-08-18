const {
    createAuthor,
    getAllAuthors,
    getAuthorById,
    findAuthorByName,
    updateAuthor,
} = require("../repositories/AuthorRepository");

const AppError = require("../utils/AppError");

const addAuthor = async ({
    firstName,
    middleName,
    lastName,
}) => {
    const existingAuthor =
        await findAuthorByName({
            firstName,
            middleName,
            lastName,
        });

    if (existingAuthor) {
        throw new AppError(
            "Author already exists.",
            409
        );
    }

    return await createAuthor({
        firstName,
        middleName,
        lastName,
    });
};

const listAuthors = async () => {
    return await getAllAuthors();
};

const getAuthorDetails = async (
    authorId
) => {
    const author =
        await getAuthorById(authorId);

    if (!author) {
        throw new AppError(
            "Author not found.",
            404
        );
    }

    return author;
};

const editAuthor = async ({
    authorId,
    firstName,
    middleName,
    lastName,
    isActive,
}) => {
    const existingAuthor =
        await getAuthorById(authorId);

    if (!existingAuthor) {
        throw new AppError(
            "Author not found.",
            404
        );
    }

    const authorWithSameName =
        await findAuthorByName({
            firstName,
            middleName,
            lastName,
        });

    if (
        authorWithSameName &&
        String(authorWithSameName.id) !==
            String(authorId)
    ) {
        throw new AppError(
            "Another author with this name already exists.",
            409
        );
    }

    return await updateAuthor({
        authorId,
        firstName,
        middleName,
        lastName,
        isActive,
    });
};

module.exports = {
    addAuthor,
    listAuthors,
    getAuthorDetails,
    editAuthor,
};
const {
    addAuthor,
    listAuthors,
    getAuthorDetails,
    editAuthor,
} = require("../services/AuthorService");

const asyncHandler = require("../middlewares/asyncHandler");

const createAuthor = asyncHandler(
    async (req, res) => {
        const author = await addAuthor(
            req.body
        );

        return res.status(201).json({
            success: true,
            message:
                "Author created successfully.",
            data: author,
        });
    }
);

const getAuthors = asyncHandler(
    async (req, res) => {
        const authors = await listAuthors();

        return res.status(200).json({
            success: true,
            message:
                "Authors retrieved successfully.",
            data: authors,
        });
    }
);

const getAuthor = asyncHandler(
    async (req, res) => {
        const author =
            await getAuthorDetails(
                req.params.id
            );

        return res.status(200).json({
            success: true,
            message:
                "Author retrieved successfully.",
            data: author,
        });
    }
);

const updateAuthor = asyncHandler(
    async (req, res) => {
        const author = await editAuthor({
            authorId: req.params.id,
            ...req.body,
        });

        return res.status(200).json({
            success: true,
            message:
                "Author updated successfully.",
            data: author,
        });
    }
);

module.exports = {
    createAuthor,
    getAuthors,
    getAuthor,
    updateAuthor,
};
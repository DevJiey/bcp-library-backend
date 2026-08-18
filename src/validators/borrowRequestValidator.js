const { z } = require("zod");

const createBorrowRequestSchema = z.object({
    bookId: z
        .number()
        .int()
        .positive("Book ID must be valid."),
});

module.exports = {
    createBorrowRequestSchema,
};
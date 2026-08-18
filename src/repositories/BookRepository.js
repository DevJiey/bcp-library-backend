const pool = require("../config/database");

const findBookByISBN = async (isbn) => {
    if (!isbn) {
        return null;
    }

    const result = await pool.query(
        `
        SELECT id
        FROM books
        WHERE isbn = $1
        LIMIT 1
        `,
        [isbn]
    );

    return result.rows[0] || null;
};

const getCategoryById = async (categoryId) => {
    const result = await pool.query(
        `
        SELECT id, name, is_active
        FROM categories
        WHERE id = $1
        LIMIT 1
        `,
        [categoryId]
    );

    return result.rows[0] || null;
};

const getPublisherById = async (publisherId) => {
    const result = await pool.query(
        `
        SELECT id, name, is_active
        FROM publishers
        WHERE id = $1
        LIMIT 1
        `,
        [publisherId]
    );

    return result.rows[0] || null;
};

const getAuthorsByIds = async (authorIds) => {
    if (!authorIds || authorIds.length === 0) {
        return [];
    }

    const result = await pool.query(
        `
        SELECT
            id,
            first_name,
            middle_name,
            last_name,
            is_active
        FROM authors
        WHERE id = ANY($1::bigint[])
        `,
        [authorIds]
    );

    return result.rows;
};

const createBook = async ({
    isbn,
    title,
    categoryId,
    publisherId,
    publicationYear,
    edition,
    description,
    coverImageUrl,
}) => {
    const result = await pool.query(
        `
        INSERT INTO books (
            isbn,
            title,
            category_id,
            publisher_id,
            publication_year,
            edition,
            description,
            cover_image_url
        )
        VALUES (
            $1, $2, $3, $4,
            $5, $6, $7, $8
        )
        RETURNING *
        `,
        [
            isbn || null,
            title,
            categoryId || null,
            publisherId || null,
            publicationYear || null,
            edition || null,
            description || null,
            coverImageUrl || null,
        ]
    );

    return result.rows[0];
};

const addBookAuthors = async ({
    bookId,
    authorIds,
}) => {
    for (let index = 0; index < authorIds.length; index++) {
        await pool.query(
            `
            INSERT INTO book_authors (
                book_id,
                author_id,
                author_order
            )
            VALUES ($1, $2, $3)
            `,
            [
                bookId,
                authorIds[index],
                index + 1,
            ]
        );
    }
};

const getAllBooks = async () => {
    const result = await pool.query(
        `
        SELECT
            b.id,
            b.isbn,
            b.title,
            b.publication_year,
            b.edition,
            b.description,
            b.cover_image_url,
            b.is_active,
            b.created_at,
            b.updated_at,

            c.id AS category_id,
            c.name AS category_name,

            p.id AS publisher_id,
            p.name AS publisher_name,

            COALESCE(
                json_agg(
                    json_build_object(
                        'id', a.id,
                        'firstName', a.first_name,
                        'middleName', a.middle_name,
                        'lastName', a.last_name,
                        'authorOrder', ba.author_order
                    )
                    ORDER BY ba.author_order
                ) FILTER (WHERE a.id IS NOT NULL),
                '[]'::json
            ) AS authors

        FROM books b

        LEFT JOIN categories c
            ON c.id = b.category_id

        LEFT JOIN publishers p
            ON p.id = b.publisher_id

        LEFT JOIN book_authors ba
            ON ba.book_id = b.id

        LEFT JOIN authors a
            ON a.id = ba.author_id

        GROUP BY
            b.id,
            c.id,
            c.name,
            p.id,
            p.name

        ORDER BY b.title ASC
        `
    );

    return result.rows;
};

const getBookById = async (bookId) => {
    const result = await pool.query(
        `
        SELECT
            b.id,
            b.isbn,
            b.title,
            b.publication_year,
            b.edition,
            b.description,
            b.cover_image_url,
            b.is_active,
            b.created_at,
            b.updated_at,

            c.id AS category_id,
            c.name AS category_name,

            p.id AS publisher_id,
            p.name AS publisher_name,

            COALESCE(
                json_agg(
                    json_build_object(
                        'id', a.id,
                        'firstName', a.first_name,
                        'middleName', a.middle_name,
                        'lastName', a.last_name,
                        'authorOrder', ba.author_order
                    )
                    ORDER BY ba.author_order
                ) FILTER (WHERE a.id IS NOT NULL),
                '[]'::json
            ) AS authors

        FROM books b

        LEFT JOIN categories c
            ON c.id = b.category_id

        LEFT JOIN publishers p
            ON p.id = b.publisher_id

        LEFT JOIN book_authors ba
            ON ba.book_id = b.id

        LEFT JOIN authors a
            ON a.id = ba.author_id

        WHERE b.id = $1

        GROUP BY
            b.id,
            c.id,
            c.name,
            p.id,
            p.name

        LIMIT 1
        `,
        [bookId]
    );

    return result.rows[0] || null;
};
const searchBooks = async ({
    search,
    categoryId,
}) => {
    const result = await pool.query(
        `
        SELECT
            b.id,
            b.isbn,
            b.title,
            b.publication_year,
            b.edition,
            b.description,
            b.cover_image_url,
            b.is_active,

            c.id AS category_id,
            c.name AS category_name,

            p.id AS publisher_id,
            p.name AS publisher_name,

            COALESCE(
                json_agg(
                    DISTINCT jsonb_build_object(
                        'id', a.id,
                        'firstName', a.first_name,
                        'middleName', a.middle_name,
                        'lastName', a.last_name
                    )
                ) FILTER (WHERE a.id IS NOT NULL),
                '[]'::json
            ) AS authors,

            COUNT(DISTINCT bc.id) AS total_copies,

            COUNT(DISTINCT bc.id)
                FILTER (
                    WHERE bc.status = 'available'
                ) AS available_copies

        FROM books b

        LEFT JOIN categories c
            ON c.id = b.category_id

        LEFT JOIN publishers p
            ON p.id = b.publisher_id

        LEFT JOIN book_authors ba
            ON ba.book_id = b.id

        LEFT JOIN authors a
            ON a.id = ba.author_id

        LEFT JOIN book_copies bc
            ON bc.book_id = b.id

        WHERE b.is_active = TRUE

          AND (
              $1::text IS NULL

              OR b.title ILIKE '%' || $1 || '%'

              OR b.isbn ILIKE '%' || $1 || '%'

              OR c.name ILIKE '%' || $1 || '%'

              OR CONCAT_WS(
                    ' ',
                    a.first_name,
                    a.middle_name,
                    a.last_name
                 ) ILIKE '%' || $1 || '%'
          )

          AND (
              $2::bigint IS NULL
              OR b.category_id = $2
          )

        GROUP BY
            b.id,
            c.id,
            c.name,
            p.id,
            p.name

        ORDER BY b.title ASC
        `,
        [
            search || null,
            categoryId || null,
        ]
    );

    return result.rows;
};

module.exports = {
    findBookByISBN,
    getCategoryById,
    getPublisherById,
    getAuthorsByIds,
    createBook,
    addBookAuthors,
    getAllBooks,
    getBookById,
    searchBooks,
};
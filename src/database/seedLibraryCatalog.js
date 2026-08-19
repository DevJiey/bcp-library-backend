require("dotenv").config();

const pool = require("../config/database");

const {
    findCategoryByName,
    createCategory,
} = require("../repositories/CategoryRepository");

const {
    findPublisherByName,
    createPublisher,
} = require("../repositories/PublisherRepository");

const {
    findAuthorByName,
    createAuthor,
} = require("../repositories/AuthorRepository");

const {
    findBookByISBN,
    createBook,
    addBookAuthors,
    getBookById,
} = require("../repositories/BookRepository");

const {
    findCopyByAccessionNumber,
    findCopyByBarcode,
    createBookCopy,
    getCopiesByBookId,
} = require("../repositories/BookCopyRepository");

/* =========================================================
   SAMPLE CATEGORIES
========================================================= */

const categories = [
    {
        name: "Cybersecurity",
        description:
            "Books related to cybersecurity, information security, cryptography, and system protection.",
    },
    {
        name: "Networking",
        description:
            "Books about computer networks, data communications, protocols, and network technologies.",
    },
    {
        name: "Programming",
        description:
            "Books about programming languages, coding practices, and software development.",
    },
    {
        name: "Database",
        description:
            "Books covering databases, SQL, database design, and data management.",
    },
    {
        name: "Computer Science",
        description:
            "Books covering algorithms, operating systems, computer architecture, and computing fundamentals.",
    },
    {
        name: "Artificial Intelligence",
        description:
            "Books about artificial intelligence, intelligent systems, and machine learning.",
    },
    {
        name: "Web Development",
        description:
            "Books about web technologies, JavaScript, HTML, CSS, and web applications.",
    },
    {
        name: "Software Engineering",
        description:
            "Books about software engineering principles, design, testing, and development processes.",
    },
];

/* =========================================================
   SAMPLE PUBLISHERS
========================================================= */

const publishers = [
    "Pearson",
    "Wiley",
    "O'Reilly Media",
    "Prentice Hall",
    "McGraw-Hill",
    "No Starch Press",
    "Addison-Wesley",
];

/* =========================================================
   20 SAMPLE BOOKS
========================================================= */

const books = [
    {
        isbn: "9780132126953",
        title: "Computer Networks",
        category: "Networking",
        publisher: "Pearson",
        publicationYear: 2010,
        edition: "5th Edition",
        description:
            "A comprehensive introduction to computer networking concepts, protocols, and network architecture.",
        authors: [
            {
                firstName: "Andrew",
                middleName: null,
                lastName: "Tanenbaum",
            },
            {
                firstName: "David",
                middleName: null,
                lastName: "Wetherall",
            },
        ],
    },

    {
        isbn: "9780078022159",
        title: "Database System Concepts",
        category: "Database",
        publisher: "McGraw-Hill",
        publicationYear: 2019,
        edition: "7th Edition",
        description:
            "Introduces relational databases, SQL, database design, transactions, and database system architecture.",
        authors: [
            {
                firstName: "Abraham",
                middleName: null,
                lastName: "Silberschatz",
            },
            {
                firstName: "Henry",
                middleName: "F.",
                lastName: "Korth",
            },
            {
                firstName: "S.",
                middleName: null,
                lastName: "Sudarshan",
            },
        ],
    },

    {
        isbn: "9781119456339",
        title: "Operating System Concepts",
        category: "Computer Science",
        publisher: "Wiley",
        publicationYear: 2018,
        edition: "10th Edition",
        description:
            "Covers operating system concepts including processes, memory, storage, file systems, and security.",
        authors: [
            {
                firstName: "Abraham",
                middleName: null,
                lastName: "Silberschatz",
            },
            {
                firstName: "Peter",
                middleName: "B.",
                lastName: "Galvin",
            },
            {
                firstName: "Greg",
                middleName: null,
                lastName: "Gagne",
            },
        ],
    },

    {
        isbn: "9780137502875",
        title: "Computer Security: Principles and Practice",
        category: "Cybersecurity",
        publisher: "Pearson",
        publicationYear: 2023,
        edition: "5th Edition",
        description:
            "Covers computer security principles, threats, cryptography, access control, and security management.",
        authors: [
            {
                firstName: "William",
                middleName: null,
                lastName: "Stallings",
            },
            {
                firstName: "Lawrie",
                middleName: null,
                lastName: "Brown",
            },
        ],
    },

    {
        isbn: "9781119642787",
        title: "Security Engineering",
        category: "Cybersecurity",
        publisher: "Wiley",
        publicationYear: 2020,
        edition: "3rd Edition",
        description:
            "Explores the design and engineering of dependable and secure computer systems.",
        authors: [
            {
                firstName: "Ross",
                middleName: null,
                lastName: "Anderson",
            },
        ],
    },

    {
        isbn: "9780135764213",
        title: "Cryptography and Network Security",
        category: "Cybersecurity",
        publisher: "Pearson",
        publicationYear: 2022,
        edition: "8th Edition",
        description:
            "Introduces cryptographic algorithms, authentication, network security, and security protocols.",
        authors: [
            {
                firstName: "William",
                middleName: null,
                lastName: "Stallings",
            },
        ],
    },

    {
        isbn: "9780132350884",
        title: "Clean Code",
        category: "Programming",
        publisher: "Prentice Hall",
        publicationYear: 2008,
        edition: "1st Edition",
        description:
            "A practical guide to writing readable, maintainable, and professional software code.",
        authors: [
            {
                firstName: "Robert",
                middleName: "C.",
                lastName: "Martin",
            },
        ],
    },

    {
        isbn: "9780135957059",
        title: "The Pragmatic Programmer",
        category: "Programming",
        publisher: "Addison-Wesley",
        publicationYear: 2019,
        edition: "20th Anniversary Edition",
        description:
            "Practical techniques and habits for effective professional software development.",
        authors: [
            {
                firstName: "David",
                middleName: null,
                lastName: "Thomas",
            },
            {
                firstName: "Andrew",
                middleName: null,
                lastName: "Hunt",
            },
        ],
    },

    {
        isbn: "9780262046305",
        title: "Introduction to Algorithms",
        category: "Computer Science",
        publisher: "Pearson",
        publicationYear: 2022,
        edition: "4th Edition",
        description:
            "A comprehensive reference for algorithms, data structures, and computational analysis.",
        authors: [
            {
                firstName: "Thomas",
                middleName: "H.",
                lastName: "Cormen",
            },
            {
                firstName: "Charles",
                middleName: "E.",
                lastName: "Leiserson",
            },
            {
                firstName: "Ronald",
                middleName: "L.",
                lastName: "Rivest",
            },
            {
                firstName: "Clifford",
                middleName: null,
                lastName: "Stein",
            },
        ],
    },

    {
        isbn: "9780134610993",
        title: "Artificial Intelligence: A Modern Approach",
        category: "Artificial Intelligence",
        publisher: "Pearson",
        publicationYear: 2020,
        edition: "4th Edition",
        description:
            "Introduces artificial intelligence including search, reasoning, learning, and intelligent agents.",
        authors: [
            {
                firstName: "Stuart",
                middleName: null,
                lastName: "Russell",
            },
            {
                firstName: "Peter",
                middleName: null,
                lastName: "Norvig",
            },
        ],
    },

    {
        isbn: "9780128201091",
        title: "Computer Organization and Design",
        category: "Computer Science",
        publisher: "Pearson",
        publicationYear: 2020,
        edition: "6th Edition",
        description:
            "Covers computer hardware, processors, memory systems, instructions, and computer architecture.",
        authors: [
            {
                firstName: "David",
                middleName: "A.",
                lastName: "Patterson",
            },
            {
                firstName: "John",
                middleName: "L.",
                lastName: "Hennessy",
            },
        ],
    },

    {
        isbn: "9780133970777",
        title: "Fundamentals of Database Systems",
        category: "Database",
        publisher: "Pearson",
        publicationYear: 2015,
        edition: "7th Edition",
        description:
            "Introduces database design, SQL, normalization, transactions, and database technologies.",
        authors: [
            {
                firstName: "Ramez",
                middleName: null,
                lastName: "Elmasri",
            },
            {
                firstName: "Shamkant",
                middleName: "B.",
                lastName: "Navathe",
            },
        ],
    },

    {
        isbn: "9780134801148",
        title:
            "Web Development and Design Foundations with HTML5",
        category: "Web Development",
        publisher: "Pearson",
        publicationYear: 2018,
        edition: "9th Edition",
        description:
            "Introduces HTML, CSS, responsive design, accessibility, and web development foundations.",
        authors: [
            {
                firstName: "Terry",
                middleName: "A.",
                lastName: "Felke-Morris",
            },
        ],
    },

    {
        isbn: "9781491910771",
        title: "Head First Java",
        category: "Programming",
        publisher: "O'Reilly Media",
        publicationYear: 2022,
        edition: "3rd Edition",
        description:
            "A beginner-friendly introduction to Java and object-oriented programming.",
        authors: [
            {
                firstName: "Kathy",
                middleName: null,
                lastName: "Sierra",
            },
            {
                firstName: "Bert",
                middleName: null,
                lastName: "Bates",
            },
            {
                firstName: "Trisha",
                middleName: null,
                lastName: "Gee",
            },
        ],
    },

    {
        isbn: "9781718502703",
        title: "Python Crash Course",
        category: "Programming",
        publisher: "No Starch Press",
        publicationYear: 2023,
        edition: "3rd Edition",
        description:
            "A hands-on introduction to Python programming with exercises and practical projects.",
        authors: [
            {
                firstName: "Eric",
                middleName: null,
                lastName: "Matthes",
            },
        ],
    },

    {
        isbn: "9781593279509",
        title: "Eloquent JavaScript",
        category: "Web Development",
        publisher: "No Starch Press",
        publicationYear: 2018,
        edition: "3rd Edition",
        description:
            "An introduction to JavaScript programming and browser-based web application development.",
        authors: [
            {
                firstName: "Marijn",
                middleName: null,
                lastName: "Haverbeke",
            },
        ],
    },

    {
        isbn: "9781492057611",
        title: "Learning SQL",
        category: "Database",
        publisher: "O'Reilly Media",
        publicationYear: 2020,
        edition: "3rd Edition",
        description:
            "A practical introduction to SQL queries, joins, grouping, relational databases, and database operations.",
        authors: [
            {
                firstName: "Alan",
                middleName: null,
                lastName: "Beaulieu",
            },
        ],
    },

    {
        isbn: "9780134527338",
        title: "Network Security Essentials",
        category: "Cybersecurity",
        publisher: "Pearson",
        publicationYear: 2016,
        edition: "6th Edition",
        description:
            "Introduces network security, cryptography, authentication, email security, and internet security.",
        authors: [
            {
                firstName: "William",
                middleName: null,
                lastName: "Stallings",
            },
        ],
    },

    {
        isbn: "9780133943030",
        title: "Software Engineering",
        category: "Software Engineering",
        publisher: "Pearson",
        publicationYear: 2015,
        edition: "10th Edition",
        description:
            "Covers software processes, requirements, design, testing, management, and software evolution.",
        authors: [
            {
                firstName: "Ian",
                middleName: null,
                lastName: "Sommerville",
            },
        ],
    },

    {
        isbn: "9780073376226",
        title: "Data Communications and Networking",
        category: "Networking",
        publisher: "McGraw-Hill",
        publicationYear: 2012,
        edition: "5th Edition",
        description:
            "Introduces data communications, networking models, protocols, transmission, and network technologies.",
        authors: [
            {
                firstName: "Behrouz",
                middleName: "A.",
                lastName: "Forouzan",
            },
        ],
    },
];

/* =========================================================
   HELPERS
========================================================= */

const getOrCreateCategory = async (
    category
) => {
    const existing =
        await findCategoryByName(
            category.name
        );

    if (existing) {
        console.log(
            `SKIP category: ${category.name}`
        );

        return existing.id;
    }

    const created =
        await createCategory(
            category
        );

    console.log(
        `CREATED category: ${category.name}`
    );

    return created.id;
};

const getOrCreatePublisher = async (
    name
) => {
    const existing =
        await findPublisherByName(
            name
        );

    if (existing) {
        console.log(
            `SKIP publisher: ${name}`
        );

        return existing.id;
    }

    const created =
        await createPublisher({
            name,
            address: null,
            contactEmail: null,
            contactNumber: null,
        });

    console.log(
        `CREATED publisher: ${name}`
    );

    return created.id;
};

const getOrCreateAuthor = async (
    author
) => {
    const existing =
        await findAuthorByName({
            firstName:
                author.firstName,
            middleName:
                author.middleName,
            lastName:
                author.lastName,
        });

    if (existing) {
        return existing.id;
    }

    const created =
        await createAuthor({
            firstName:
                author.firstName,
            middleName:
                author.middleName,
            lastName:
                author.lastName,
        });

    console.log(
        `CREATED author: ${author.firstName} ${author.lastName}`
    );

    return created.id;
};

const createTwoCopies = async (
    bookId,
    bookIndex
) => {
    const existingCopies =
        await getCopiesByBookId(
            bookId
        );

    if (
        existingCopies.length >= 2
    ) {
        console.log(
            `SKIP copies: already has ${existingCopies.length}`
        );

        return 0;
    }

    let created = 0;

    for (
        let copyNumber =
            existingCopies.length + 1;
        copyNumber <= 2;
        copyNumber++
    ) {
        let attempt = 1;

        while (true) {
            const bookSerial =
                String(
                    bookIndex + 1
                ).padStart(
                    3,
                    "0"
                );

            const copySerial =
                String(
                    copyNumber
                ).padStart(
                    2,
                    "0"
                );

            const attemptSuffix =
                attempt === 1
                    ? ""
                    : `-${attempt}`;

            const accessionNumber =
                `ACC-${bookSerial}-${copySerial}${attemptSuffix}`;

            const barcode =
                `BCP-BK-${bookSerial}-${copySerial}${attemptSuffix}`;

            const [
                accessionExists,
                barcodeExists,
            ] =
                await Promise.all([
                    findCopyByAccessionNumber(
                        accessionNumber
                    ),

                    findCopyByBarcode(
                        barcode
                    ),
                ]);

            if (
                accessionExists ||
                barcodeExists
            ) {
                attempt++;
                continue;
            }

            await createBookCopy({
                bookId,
                accessionNumber,
                barcode,

                shelfLocation:
                    `IT-${bookSerial}`,

                condition:
                    "good",

                acquiredAt:
                    new Date()
                        .toISOString()
                        .slice(0, 10),
            });

            console.log(
                `CREATED copy: ${barcode}`
            );

            created++;

            break;
        }
    }

    return created;
};

/* =========================================================
   MAIN SEED
========================================================= */

const seedLibraryCatalog =
    async () => {
        let categoriesCreated = 0;
        let publishersCreated = 0;
        let authorsCreated = 0;

        let booksCreated = 0;
        let booksSkipped = 0;
        let copiesCreated = 0;

        try {
            console.log(
                "\n=================================="
            );

            console.log(
                " BCP LIBRARY CATALOG SEEDER"
            );

            console.log(
                "=================================="
            );

            console.log(
                "Target: 20 books / 40 copies"
            );

            console.log(
                "==================================\n"
            );

            await pool.query(
                "SELECT NOW()"
            );

            console.log(
                "Connected to PostgreSQL.\n"
            );

            /* -------------------------
               CATEGORIES
            ------------------------- */

            console.log(
                "Preparing categories...\n"
            );

            const categoryMap = {};

            for (
                const category of
                    categories
            ) {
                const existing =
                    await findCategoryByName(
                        category.name
                    );

                if (existing) {
                    categoryMap[
                        category.name
                    ] = existing.id;

                    console.log(
                        `SKIP category: ${category.name}`
                    );

                    continue;
                }

                const created =
                    await createCategory(
                        category
                    );

                categoryMap[
                    category.name
                ] = created.id;

                categoriesCreated++;

                console.log(
                    `CREATED category: ${category.name}`
                );
            }

            /* -------------------------
               PUBLISHERS
            ------------------------- */

            console.log(
                "\nPreparing publishers...\n"
            );

            const publisherMap = {};

            for (
                const publisher of
                    publishers
            ) {
                const existing =
                    await findPublisherByName(
                        publisher
                    );

                if (existing) {
                    publisherMap[
                        publisher
                    ] = existing.id;

                    console.log(
                        `SKIP publisher: ${publisher}`
                    );

                    continue;
                }

                const created =
                    await createPublisher({
                        name:
                            publisher,
                        address:
                            null,
                        contactEmail:
                            null,
                        contactNumber:
                            null,
                    });

                publisherMap[
                    publisher
                ] = created.id;

                publishersCreated++;

                console.log(
                    `CREATED publisher: ${publisher}`
                );
            }

            /* -------------------------
               BOOKS
            ------------------------- */

            console.log(
                "\nPreparing books...\n"
            );

            for (
                let index = 0;
                index < books.length;
                index++
            ) {
                const item =
                    books[index];

                console.log(
                    `\n[${index + 1}/${books.length}] ${item.title}`
                );

                const authorIds = [];

                for (
                    const author of
                        item.authors
                ) {
                    const existing =
                        await findAuthorByName(
                            {
                                firstName:
                                    author.firstName,

                                middleName:
                                    author.middleName,

                                lastName:
                                    author.lastName,
                            }
                        );

                    if (existing) {
                        authorIds.push(
                            existing.id
                        );

                        continue;
                    }

                    const created =
                        await createAuthor(
                            {
                                firstName:
                                    author.firstName,

                                middleName:
                                    author.middleName,

                                lastName:
                                    author.lastName,
                            }
                        );

                    authorsCreated++;

                    authorIds.push(
                        created.id
                    );

                    console.log(
                        `CREATED author: ${author.firstName} ${author.lastName}`
                    );
                }

                let bookId;

                const existingBook =
                    await findBookByISBN(
                        item.isbn
                    );

                if (existingBook) {
                    bookId =
                        existingBook.id;

                    booksSkipped++;

                    console.log(
                        "SKIP book: ISBN already exists"
                    );
                } else {
                    const createdBook =
                        await createBook({
                            isbn:
                                item.isbn,

                            title:
                                item.title,

                            categoryId:
                                categoryMap[
                                    item
                                        .category
                                ],

                            publisherId:
                                publisherMap[
                                    item
                                        .publisher
                                ],

                            publicationYear:
                                item.publicationYear,

                            edition:
                                item.edition,

                            description:
                                item.description,

                            coverImageUrl:
                                null,
                        });

                    await addBookAuthors({
                        bookId:
                            createdBook.id,

                        authorIds,
                    });

                    bookId =
                        createdBook.id;

                    booksCreated++;

                    console.log(
                        "CREATED book"
                    );
                }

                copiesCreated +=
                    await createTwoCopies(
                        bookId,
                        index
                    );
            }

            /* -------------------------
               SUMMARY
            ------------------------- */

            console.log(
                "\n=================================="
            );

            console.log(
                " CATALOG SEED COMPLETE"
            );

            console.log(
                "=================================="
            );

            console.log(
                `Categories created: ${categoriesCreated}`
            );

            console.log(
                `Publishers created: ${publishersCreated}`
            );

            console.log(
                `Authors created: ${authorsCreated}`
            );

            console.log(
                `Books created: ${booksCreated}`
            );

            console.log(
                `Books skipped: ${booksSkipped}`
            );

            console.log(
                `Copies created: ${copiesCreated}`
            );

            console.log(
                "==================================\n"
            );
        } catch (error) {
            console.error(
                "\nCATALOG SEED FAILED:"
            );

            console.error(
                error.message
            );

            process.exitCode = 1;
        } finally {
            await pool.end();
        }
    };

seedLibraryCatalog();
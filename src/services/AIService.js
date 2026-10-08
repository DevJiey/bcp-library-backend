
const {
    GoogleGenAI,
    Type,
} = require("@google/genai");

const {
    searchLibraryBooks,
} = require("./AIBookSearchService");

// Convert Gemini provider errors into safe API errors.
const handleGeminiError = (error) => {
    const providerStatus = Number(
        error.status ||
        error.code ||
        error.statusCode
    );

    const providerMessage = String(
        error.message || ""
    ).toLowerCase();

    const isQuotaError =
        providerStatus === 429 ||
        providerMessage.includes("resource_exhausted") ||
        providerMessage.includes("quota exceeded");

    const isTimeout =
        providerStatus === 408 ||
        providerStatus === 504 ||
        error.name === "AbortError" ||
        providerMessage.includes("deadline_exceeded");

    const isUnavailable =
        providerStatus === 500 ||
        providerStatus === 502 ||
        providerStatus === 503;

    const safeError = new Error();
    safeError.isSafeAIError = true;

    if (isQuotaError) {
        safeError.statusCode = 503;
        safeError.message =
            "AI assistant is temporarily unavailable " +
            "due to usage limits. Please try again later.";
    } else if (isTimeout) {
        safeError.statusCode = 504;
        safeError.message =
            "AI assistant took too long to respond. " +
            "Please try again.";
    } else if (isUnavailable) {
        safeError.statusCode = 503;
        safeError.message =
            "AI assistant is temporarily unavailable. " +
            "Please try again later.";
    } else {
        safeError.statusCode = 502;
        safeError.message =
            "AI assistant could not process your request. " +
            "Please try again later.";
    }

    return safeError;
};

const getAIClient = () => {
    if (!process.env.GEMINI_API_KEY) {
        throw new Error(
            "GEMINI_API_KEY is not configured."
        );
    }

    return new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
    });
};

const bookSearchTool = {
    name: "search_library_books",
    description:
        "Search the real BCP Library catalog by book title, " +
        "author, ISBN, or category. Use this tool whenever " +
        "the user asks whether a book exists, is available, " +
        "or requests books from the library catalog.",

    parameters: {
        type: Type.OBJECT,
        properties: {
            keyword: {
                type: Type.STRING,
                description:
                    "Book title, author, ISBN, or category " +
                    "to search for.",
            },
        },
        required: ["keyword"],
    },
};

const systemInstruction = `
You are the BCP Library Management System AI Assistant.

Your purpose is to help students, staff, and
administrators with library-related questions.

Guidelines:
- Respond in English, Filipino, or Taglish
  depending on the user's language.
- Be helpful, clear, and professional.
- For catalog searches and book availability,
  use the search_library_books tool.
- Never invent books, availability, borrowing
  records, due dates, or library policies.
- Only report book availability using verified
  results returned by the backend.
- If no books match, explain that no matching
  books were found in the current catalog.
- If availableCopies is 0, explain that no
  copies are currently available.
- Do not claim a book is reserved or borrowed
  by a particular person.
- Do not reveal private user information.
- Do not execute administrative actions.
`.trim();

const generateAIResponse = async (message) => {
    const ai = getAIClient();

    const model =
        process.env.GEMINI_MODEL ||
        "gemini-3.1-flash-lite";

    const contents = [
        {
            role: "user",
            parts: [
                {
                    text: message,
                },
            ],
        },
    ];

    const config = {
        systemInstruction,
        temperature: 0.3,
        maxOutputTokens: 1024,
        tools: [
            {
                functionDeclarations: [
                    bookSearchTool,
                ],
            },
        ],
    };

    // Handle only Gemini provider errors here.
    // Database errors should continue to the
    // application's normal error handler.
    const generateContent = async () => {
        try {
            return await ai.models.generateContent({
                model,
                contents,
                config,
            });
        } catch (error) {
            throw handleGeminiError(error);
        }
    };

    let response = await generateContent();

    // Allow at most two tool-call rounds.
    for (let round = 0; round < 2; round++) {
        const calls = response.functionCalls || [];

        if (calls.length === 0) {
            return (
                response.text?.trim() ||
                "Sorry, I could not generate a response."
            );
        }

        const modelParts =
            response.candidates?.[0]?.content?.parts;

        if (!modelParts?.length) {
            throw new Error(
                "Gemini returned an invalid tool response."
            );
        }

        contents.push({
            role: "model",
            parts: modelParts,
        });

        const toolResults = [];

        for (const call of calls) {
            if (call.name !== "search_library_books") {
                throw new Error(
                    "Unsupported AI tool requested."
                );
            }

            const keyword = call.args?.keyword;

            let result;

            if (
                typeof keyword !== "string" ||
                !keyword.trim()
            ) {
                result = {
                    error: "A search keyword is required.",
                };
            } else {
                const books = await searchLibraryBooks(
                    keyword
                );

                result = {
                    keyword,
                    books,
                    count: books.length,
                };
            }

            toolResults.push({
                functionResponse: {
                    name: "search_library_books",
                    id: call.id,
                    response: result,
                },
            });
        }

        contents.push({
            role: "user",
            parts: toolResults,
        });

        response = await generateContent();
    }

    // Do not provide an unverified answer if
    // the model keeps requesting more tools.
    if ((response.functionCalls || []).length > 0) {
        return (
            "Sorry, I could not complete the " +
            "library catalog search. Please try again."
        );
    }

    return (
        response.text?.trim() ||
        "Sorry, I could not generate a response."
    );
};

module.exports = {
    generateAIResponse,
};

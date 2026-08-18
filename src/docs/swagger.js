const swaggerJsdoc = require("swagger-jsdoc");

const isProduction =
    process.env.NODE_ENV === "production";

const options = {
    definition: {
        openapi: "3.0.0",

        info: {
            title: "BCP Library Management System API",
            version: "1.0.0",
            description:
                "REST API documentation for the BCP Library Management System.",
        },

        servers: [
            {
                url: isProduction
                    ? "https://bcp-library-backend-production.up.railway.app/api/v1"
                    : "http://localhost:5000/api/v1",

                description: isProduction
                    ? "Production Server"
                    : "Local Development Server",
            },
        ],

        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
    },

    apis: [
        "./src/routes/*.js",
        "./src/app.js",
    ],
};

const swaggerSpec =
    swaggerJsdoc(options);

module.exports = swaggerSpec;
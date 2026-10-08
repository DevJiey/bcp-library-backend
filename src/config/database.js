
const { Pool } = require("pg");

const isProduction =
    process.env.NODE_ENV === "production";

const databaseUrl = process.env.DATABASE_URL;

const poolConfig = databaseUrl
    ? {
          connectionString: databaseUrl,

          // Require TLS and verify the database
          // server's SSL certificate.
          ssl: {
              rejectUnauthorized: true,
          },
      }
    : {
          host: process.env.DB_HOST,
          port: process.env.DB_PORT
              ? Number(process.env.DB_PORT)
              : 5432,
          database: process.env.DB_NAME,
          user: process.env.DB_USER,
          password: process.env.DB_PASSWORD,

          // Local PostgreSQL typically runs
          // without TLS.
          ssl: false,
      };

const pool = new Pool(poolConfig);

pool.on("connect", () => {
    if (!isProduction) {
        console.log(
            "Connected to PostgreSQL database."
        );
    }
});

pool.on("error", (error) => {
    console.error(
        "PostgreSQL connection error:",
        error.message
    );
});

module.exports = pool;

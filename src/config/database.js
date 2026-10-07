const { Pool } = require("pg");

const isProduction = process.env.NODE_ENV === "production";

const poolConfig = process.env.DATABASE_URL
    ? {
          connectionString: process.env.DATABASE_URL,
          ssl: isProduction
              ? {
                    rejectUnauthorized: false,
                }
              : false,
      }
    : {
          host: process.env.DB_HOST,
          port: process.env.DB_PORT,
          database: process.env.DB_NAME,
          user: process.env.DB_USER,
          password: process.env.DB_PASSWORD,
      };

const pool = new Pool(poolConfig);

pool.on("connect", () => {
    console.log("Connected to PostgreSQL database.");
});

pool.on("error", (error) => {
    console.error("PostgreSQL connection error:", error.message);
});

module.exports = pool;
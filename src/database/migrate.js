require("dotenv").config();

const fs = require("fs");
const path = require("path");
const pool = require("../config/database");

const migrationsDirectory = path.join(__dirname, "migrations");

const runMigrations = async () => {
    const client = await pool.connect();

    try {
        console.log("Running database migrations...");

        await client.query(`
            CREATE TABLE IF NOT EXISTS schema_migrations (
                id BIGSERIAL PRIMARY KEY,
                filename VARCHAR(255) UNIQUE NOT NULL,
                executed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
            );
        `);

        const files = fs
            .readdirSync(migrationsDirectory)
            .filter((file) => file.endsWith(".sql"))
            .sort();

        for (const file of files) {
            const result = await client.query(
                `
                SELECT id
                FROM schema_migrations
                WHERE filename = $1
                `,
                [file]
            );

            if (result.rowCount > 0) {
                console.log(`Skipped: ${file}`);
                continue;
            }

            console.log(`Running: ${file}`);

            const filePath = path.join(migrationsDirectory, file);
            const sql = fs.readFileSync(filePath, "utf8");

            await client.query("BEGIN");

            try {
                await client.query(sql);

                await client.query(
                    `
                    INSERT INTO schema_migrations (filename)
                    VALUES ($1)
                    `,
                    [file]
                );

                await client.query("COMMIT");

                console.log(`Completed: ${file}`);
            } catch (error) {
                await client.query("ROLLBACK");
                throw error;
            }
        }

        console.log("All migrations completed successfully.");
    } catch (error) {
        console.error("Migration failed:", error.message);
        process.exitCode = 1;
    } finally {
        client.release();
        await pool.end();
    }
};

runMigrations();
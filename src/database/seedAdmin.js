require("dotenv").config();

const bcrypt = require("bcrypt");
const pool = require("../config/database");

const seedAdmin = async () => {
    const schoolId = "ADMIN-001";
    const email = "admin@bcp-library.local";
    try {
        const password = process.env.ADMIN_INITIAL_PASSWORD;

        if (!password) {
            throw new Error(
                "ADMIN_INITIAL_PASSWORD environment variable is required."
            );
        }
        const existingAdmin = await pool.query(
            `
            SELECT id
            FROM users
            WHERE school_id = $1
            LIMIT 1
            `,
            [schoolId]
        );

        if (existingAdmin.rowCount > 0) {
            console.log("Admin account already exists.");
            return;
        }

        const passwordHash = await bcrypt.hash(password, 12);

        await pool.query(
            `
            INSERT INTO users (
                school_id,
                email,
                password_hash,
                first_name,
                middle_name,
                last_name,
                role,
                borrower_type,
                account_status,
                is_first_login
            )
            VALUES (
                $1,
                $2,
                $3,
                $4,
                $5,
                $6,
                $7,
                $8,
                $9,
                $10
            )
            `,
            [
                schoolId,
                email,
                passwordHash,
                "System",
                null,
                "Administrator",
                "admin",
                null,
                "active",
                true,
            ]
        );

        console.log("Admin account created successfully.");
        console.log(`School ID: ${schoolId}`);
        console.log(`Temporary Password: ${password}`);
    } catch (error) {
        console.error("Failed to create admin account:", error.message);
        process.exitCode = 1;
    } finally {
        await pool.end();
    }
};

seedAdmin();
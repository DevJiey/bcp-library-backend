require("dotenv").config();

const pool = require("../config/database");

const seedDepartments = async () => {
    try {
        const departments = [
            {
                code: "CIT",
                name: "College of Information Technology",
            },
            {
                code: "CAS",
                name: "College of Arts and Sciences",
            },
            {
                code: "CBA",
                name: "College of Business Administration",
            },
        ];

        for (const department of departments) {
            await pool.query(
                `
                INSERT INTO departments (
                    code,
                    name
                )
                VALUES ($1, $2)
                ON CONFLICT (code) DO NOTHING
                `,
                [
                    department.code,
                    department.name,
                ]
            );
        }

        console.log("Departments seeded successfully.");
    } catch (error) {
        console.error(
            "Failed to seed departments:",
            error.message
        );

        process.exitCode = 1;
    } finally {
        await pool.end();
    }
};

seedDepartments();
const pool = require("../config/database");

const getAllSettings = async () => {
    const result = await pool.query(
        `
        SELECT
            id,
            setting_key,
            setting_value,
            description,
            created_at,
            updated_at
        FROM library_settings
        ORDER BY setting_key ASC
        `
    );

    return result.rows;
};

const getSettingByKey = async (settingKey) => {
    const result = await pool.query(
        `
        SELECT
            id,
            setting_key,
            setting_value,
            description,
            created_at,
            updated_at
        FROM library_settings
        WHERE setting_key = $1
        LIMIT 1
        `,
        [settingKey]
    );

    return result.rows[0] || null;
};

const updateSettingByKey = async ({
    settingKey,
    settingValue,
}) => {
    const result = await pool.query(
        `
        UPDATE library_settings
        SET setting_value = $1
        WHERE setting_key = $2
        RETURNING
            id,
            setting_key,
            setting_value,
            description,
            created_at,
            updated_at
        `,
        [
            String(settingValue),
            settingKey,
        ]
    );

    return result.rows[0] || null;
};

module.exports = {
    getAllSettings,
    getSettingByKey,
    updateSettingByKey,
};
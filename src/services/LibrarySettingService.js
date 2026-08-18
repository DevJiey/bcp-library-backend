const {
    getAllSettings,
    getSettingByKey,
    updateSettingByKey,
} = require("../repositories/LibrarySettingRepository");

const AppError = require("../utils/AppError");

const ALLOWED_SETTINGS = {
    student_borrow_limit: {
        min: 1,
        max: 20,
    },

    faculty_borrow_limit: {
        min: 1,
        max: 20,
    },

    borrowing_period_days: {
        min: 1,
        max: 30,
    },
};

const listSettings = async () => {
    return await getAllSettings();
};

const getSettingDetails = async (
    settingKey
) => {
    const setting =
        await getSettingByKey(
            settingKey
        );

    if (!setting) {
        throw new AppError(
            "Library setting not found.",
            404
        );
    }

    return setting;
};

const updateSetting = async ({
    settingKey,
    settingValue,
}) => {
    const config =
        ALLOWED_SETTINGS[
            settingKey
        ];

    if (!config) {
        throw new AppError(
            "This library setting cannot be modified.",
            400
        );
    }

    const numericValue =
        Number(settingValue);

    if (
        !Number.isInteger(
            numericValue
        )
    ) {
        throw new AppError(
            "Setting value must be a whole number.",
            400
        );
    }

    if (
        numericValue < config.min ||
        numericValue > config.max
    ) {
        throw new AppError(
            `Setting value must be between ${config.min} and ${config.max}.`,
            400
        );
    }

    const existingSetting =
        await getSettingByKey(
            settingKey
        );

    if (!existingSetting) {
        throw new AppError(
            "Library setting not found.",
            404
        );
    }

    return await updateSettingByKey({
        settingKey,
        settingValue:
            numericValue,
    });
};

module.exports = {
    listSettings,
    getSettingDetails,
    updateSetting,
};
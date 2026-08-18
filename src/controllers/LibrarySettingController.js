const {
    listSettings,
    getSettingDetails,
    updateSetting,
} = require("../services/LibrarySettingService");

const {
    recordAuditLog,
} = require("../services/AuditLogService");

const {
    getRequestMetadata,
} = require("../utils/requestMetadata");

const asyncHandler = require("../middlewares/asyncHandler");

const getLibrarySettings = asyncHandler(
    async (req, res) => {
        const settings = await listSettings();

        return res.status(200).json({
            success: true,
            message: "Library settings retrieved successfully.",
            data: settings,
        });
    }
);

const getLibrarySetting = asyncHandler(
    async (req, res) => {
        const setting = await getSettingDetails(
            req.params.key
        );

        return res.status(200).json({
            success: true,
            message: "Library setting retrieved successfully.",
            data: setting,
        });
    }
);

const updateLibrarySetting = asyncHandler(
    async (req, res) => {
        const setting = await updateSetting({
            settingKey: req.params.key,
            settingValue: req.body.settingValue,
        });

        const {
            ipAddress,
            userAgent,
        } = getRequestMetadata(req);

        await recordAuditLog({
            userId: req.user.id,
            action: "UPDATE_LIBRARY_SETTING",
            module: "Settings",
            entityType: "library_setting",
            entityId: setting.id,
            description:
                `Updated ${setting.setting_key} to ${setting.setting_value}.`,
            ipAddress,
            userAgent,
        });

        return res.status(200).json({
            success: true,
            message: "Library setting updated successfully.",
            data: setting,
        });
    }
);

module.exports = {
    getLibrarySettings,
    getLibrarySetting,
    updateLibrarySetting,
};
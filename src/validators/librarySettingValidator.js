const { z } = require("zod");

const updateLibrarySettingSchema = z.object({
    settingValue: z
        .union([
            z.number(),
            z.string(),
        ])
        .refine(
            (value) => {
                const numericValue = Number(value);

                return (
                    Number.isInteger(numericValue) &&
                    numericValue > 0
                );
            },
            {
                message:
                    "Setting value must be a positive whole number.",
            }
        ),
});

module.exports = {
    updateLibrarySettingSchema,
};
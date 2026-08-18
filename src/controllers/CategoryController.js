const {
    addCategory,
    listCategories,
    getCategoryDetails,
    editCategory,
} = require("../services/CategoryService");

const asyncHandler = require("../middlewares/asyncHandler");

const createCategory = asyncHandler(
    async (req, res) => {
        const category = await addCategory(
            req.body
        );

        return res.status(201).json({
            success: true,
            message:
                "Category created successfully.",
            data: category,
        });
    }
);

const getCategories = asyncHandler(
    async (req, res) => {
        const categories =
            await listCategories();

        return res.status(200).json({
            success: true,
            message:
                "Categories retrieved successfully.",
            data: categories,
        });
    }
);

const getCategory = asyncHandler(
    async (req, res) => {
        const category =
            await getCategoryDetails(
                req.params.id
            );

        return res.status(200).json({
            success: true,
            message:
                "Category retrieved successfully.",
            data: category,
        });
    }
);

const updateCategory = asyncHandler(
    async (req, res) => {
        const category =
            await editCategory({
                categoryId: req.params.id,
                ...req.body,
            });

        return res.status(200).json({
            success: true,
            message:
                "Category updated successfully.",
            data: category,
        });
    }
);

module.exports = {
    createCategory,
    getCategories,
    getCategory,
    updateCategory,
};
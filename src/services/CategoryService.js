const {
    createCategory,
    getAllCategories,
    getCategoryById,
    findCategoryByName,
    updateCategory,
} = require("../repositories/CategoryRepository");

const AppError = require("../utils/AppError");

const addCategory = async ({
    name,
    description,
}) => {
    const existingCategory =
        await findCategoryByName(name);

    if (existingCategory) {
        throw new AppError(
            "Category already exists.",
            409
        );
    }

    return await createCategory({
        name,
        description,
    });
};

const listCategories = async () => {
    return await getAllCategories();
};

const getCategoryDetails = async (
    categoryId
) => {
    const category =
        await getCategoryById(categoryId);

    if (!category) {
        throw new AppError(
            "Category not found.",
            404
        );
    }

    return category;
};

const editCategory = async ({
    categoryId,
    name,
    description,
    isActive,
}) => {
    const existingCategory =
        await getCategoryById(categoryId);

    if (!existingCategory) {
        throw new AppError(
            "Category not found.",
            404
        );
    }

    const categoryWithSameName =
        await findCategoryByName(name);

    if (
        categoryWithSameName &&
        String(categoryWithSameName.id) !==
            String(categoryId)
    ) {
        throw new AppError(
            "Another category with this name already exists.",
            409
        );
    }

    return await updateCategory({
        categoryId,
        name,
        description,
        isActive,
    });
};

module.exports = {
    addCategory,
    listCategories,
    getCategoryDetails,
    editCategory,
};
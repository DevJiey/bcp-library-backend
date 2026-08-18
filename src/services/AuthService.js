const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const {
    findUserBySchoolId,
    findUserById,
    updateLastLogin,
} = require("../repositories/AuthRepository");

const AppError = require("../utils/AppError");

const login = async ({
    schoolId,
    password,
}) => {
    const user =
        await findUserBySchoolId(
            schoolId
        );

    if (!user) {
        throw new AppError(
            "Invalid school ID or password.",
            401
        );
    }

    if (
        user.account_status === "inactive"
    ) {
        throw new AppError(
            "Your account is inactive.",
            403
        );
    }

    if (
        user.account_status === "suspended"
    ) {
        throw new AppError(
            "Your account is suspended.",
            403
        );
    }

    const passwordMatches =
        await bcrypt.compare(
            password,
            user.password_hash
        );

    if (!passwordMatches) {
        throw new AppError(
            "Invalid school ID or password.",
            401
        );
    }

    const token = jwt.sign(
        {
            userId: user.id,
            schoolId: user.school_id,
            role: user.role,
            borrowerType:
                user.borrower_type,
        },
        process.env.JWT_SECRET,
        {
            expiresIn:
                process.env.JWT_EXPIRES_IN ||
                "8h",
        }
    );

    await updateLastLogin(user.id);

    return {
        token,
        user: {
            id: user.id,
            schoolId: user.school_id,
            email: user.email,
            firstName: user.first_name,
            middleName: user.middle_name,
            lastName: user.last_name,
            role: user.role,
            borrowerType:
                user.borrower_type,
            accountStatus:
                user.account_status,
            isFirstLogin:
                user.is_first_login,
        },
    };
};

const getCurrentUser = async (
    userId
) => {
    const user =
        await findUserById(userId);

    if (!user) {
        throw new AppError(
            "User account not found.",
            404
        );
    }

    return {
        id: user.id,
        schoolId: user.school_id,
        email: user.email,
        firstName: user.first_name,
        middleName: user.middle_name,
        lastName: user.last_name,
        role: user.role,
        borrowerType:
            user.borrower_type,
        accountStatus:
            user.account_status,
        isFirstLogin:
            user.is_first_login,
        lastLoginAt:
            user.last_login_at,
        createdAt:
            user.created_at,
        updatedAt:
            user.updated_at,
    };
};

module.exports = {
    login,
    getCurrentUser,
};
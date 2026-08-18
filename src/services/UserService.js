const bcrypt = require("bcrypt");

const {
    findUserBySchoolId,
    findUserByEmail,
    createUser,
    createStudentProfile,
    createFacultyProfile,
    getAllUsers,
    getAllBorrowers,
    getUserById,
    getStudentProfileByUserId,
    getFacultyProfileByUserId,
    updateUserProfile,
    updateStudentProfile,
    updateFacultyProfile,
    updateUserStatus,
} = require("../repositories/UserRepository");

const AppError = require("../utils/AppError");

const createAccount = async (userData) => {
    const {
        schoolId,
        email,
        password,
        firstName,
        middleName,
        lastName,
        role,
        borrowerType,
        program,
        yearLevel,
        section,
        departmentId,
        position,
        employmentStatus,
    } = userData;

    const existingSchoolId =
        await findUserBySchoolId(schoolId);

    if (existingSchoolId) {
        throw new AppError(
            "School ID already exists.",
            409
        );
    }

    const existingEmail =
        await findUserByEmail(email);

    if (existingEmail) {
        throw new AppError(
            "Email already exists.",
            409
        );
    }

    const passwordHash =
        await bcrypt.hash(password, 12);

    const user = await createUser({
        schoolId,
        email,
        passwordHash,
        firstName,
        middleName,
        lastName,
        role,
        borrowerType,
    });

    let studentProfile = null;
    let facultyProfile = null;

    if (
        role === "borrower" &&
        borrowerType === "student"
    ) {
        studentProfile =
            await createStudentProfile({
                userId: user.id,
                program,
                yearLevel,
                section,
            });
    }

    if (
        role === "borrower" &&
        borrowerType === "faculty"
    ) {
        facultyProfile =
            await createFacultyProfile({
                userId: user.id,
                departmentId,
                position,
                employmentStatus,
            });
    }

    return {
        user,
        studentProfile,
        facultyProfile,
    };
};

const listUsers = async (
    requestingUser
) => {
    if (
        requestingUser.role === "admin"
    ) {
        return await getAllUsers();
    }

    if (
        requestingUser.role === "staff"
    ) {
        return await getAllBorrowers();
    }

    throw new AppError(
        "You are not authorized to view users.",
        403
    );
};

const getUserDetails = async ({
    requestingUser,
    userId,
}) => {
    const user =
        await getUserById(userId);

    if (!user) {
        throw new AppError(
            "User not found.",
            404
        );
    }

    if (
        requestingUser.role === "staff" &&
        user.role !== "borrower"
    ) {
        throw new AppError(
            "Staff can only access borrower accounts.",
            403
        );
    }

    if (
        !["admin", "staff"].includes(
            requestingUser.role
        )
    ) {
        throw new AppError(
            "You are not authorized to view this user.",
            403
        );
    }

    return user;
};

const getMyProfile = async (
    userId
) => {
    const user =
        await getUserById(userId);

    if (!user) {
        throw new AppError(
            "User account not found.",
            404
        );
    }

    let studentProfile = null;
    let facultyProfile = null;

    if (
        user.role === "borrower" &&
        user.borrower_type === "student"
    ) {
        studentProfile =
            await getStudentProfileByUserId(
                userId
            );
    }

    if (
        user.role === "borrower" &&
        user.borrower_type === "faculty"
    ) {
        facultyProfile =
            await getFacultyProfileByUserId(
                userId
            );
    }

    return {
        user,
        studentProfile,
        facultyProfile,
    };
};

const updateMyProfile = async ({
    userId,
    email,
    firstName,
    middleName,
    lastName,
    program,
    yearLevel,
    section,
    departmentId,
    position,
    employmentStatus,
}) => {
    const existingUser =
        await getUserById(userId);

    if (!existingUser) {
        throw new AppError(
            "User account not found.",
            404
        );
    }

    if (
        existingUser.role !== "borrower"
    ) {
        throw new AppError(
            "Only borrower profiles can be updated using this endpoint.",
            403
        );
    }

    const existingEmail =
        await findUserByEmail(email);

    if (
        existingEmail &&
        String(existingEmail.id) !==
            String(userId)
    ) {
        throw new AppError(
            "Email already exists.",
            409
        );
    }

    const updatedUser =
        await updateUserProfile({
            userId,
            email,
            firstName,
            middleName,
            lastName,
        });

    let studentProfile = null;
    let facultyProfile = null;

    if (
        existingUser.borrower_type ===
        "student"
    ) {
        studentProfile =
            await updateStudentProfile({
                userId,
                program,
                yearLevel,
                section,
            });

        if (!studentProfile) {
            throw new AppError(
                "Student profile not found.",
                404
            );
        }
    }

    if (
        existingUser.borrower_type ===
        "faculty"
    ) {
        facultyProfile =
            await updateFacultyProfile({
                userId,
                departmentId,
                position,
                employmentStatus,
            });

        if (!facultyProfile) {
            throw new AppError(
                "Faculty profile not found.",
                404
            );
        }
    }

    return {
        user: updatedUser,
        studentProfile,
        facultyProfile,
    };
};

const changeUserStatus = async ({
    requestingUser,
    userId,
    accountStatus,
}) => {
    if (
        requestingUser.role !== "admin"
    ) {
        throw new AppError(
            "Only administrators can change account status.",
            403
        );
    }

    const existingUser =
        await getUserById(userId);

    if (!existingUser) {
        throw new AppError(
            "User not found.",
            404
        );
    }

    if (
        existingUser.role === "admin" &&
        String(existingUser.id) ===
            String(requestingUser.id)
    ) {
        throw new AppError(
            "You cannot change the status of your own admin account.",
            400
        );
    }

    return await updateUserStatus({
        userId,
        accountStatus,
    });
};

module.exports = {
    createAccount,
    listUsers,
    getUserDetails,
    getMyProfile,
    updateMyProfile,
    changeUserStatus,
};
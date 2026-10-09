
const bcrypt = require("bcrypt");

const AppError = require("../utils/AppError");

const {
    generateInvitationToken,
    hashInvitationToken,
} = require("../utils/invitationToken");

const {
    createPendingBorrower,
    findValidInvitation,
    completeInvitation,
    replaceInvitation,
} = require("../repositories/BorrowerInvitationRepository");

const {
    sendBorrowerInvitation,
} = require("./InvitationEmailService");

const createBorrowerInvitation = async (data) => {
    const {
        schoolId,
        email,
        firstName,
        middleName,
        lastName,
        borrowerType,
        program,
        yearLevel,
        section,
        departmentId,
        position,
        employmentStatus,
    } = data;

    if (
        !schoolId ||
        !email ||
        !firstName ||
        !lastName ||
        !["student", "faculty"].includes(borrowerType)
    ) {
        throw new AppError(
            "Required borrower details are missing.",
            400
        );
    }

    if (
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
        throw new AppError(
            "Please provide a valid email address.",
            400
        );
    }

    if (
        borrowerType === "student" &&
        (
            !program ||
            !Number.isInteger(yearLevel) ||
            yearLevel < 1 ||
            yearLevel > 6
        )
    ) {
        throw new AppError(
            "A valid program and year level are required.",
            400
        );
    }

    if (
        borrowerType === "faculty" &&
        (
            !Number.isInteger(departmentId) ||
            departmentId <= 0
        )
    ) {
        throw new AppError(
            "A valid department is required.",
            400
        );
    }

    const {
        token,
        tokenHash,
        expiresAt,
    } = generateInvitationToken();

    // An unknown random password prevents login
    // before the borrower completes setup.
    const unusablePassword = require("node:crypto")
        .randomBytes(48)
        .toString("hex");

    const passwordHash = await bcrypt.hash(
        unusablePassword,
        12
    );

    let borrower;

    try {
        borrower = await createPendingBorrower({
            schoolId: schoolId.trim(),
            email: email.trim().toLowerCase(),
            passwordHash,
            firstName: firstName.trim(),
            middleName: middleName?.trim() || null,
            lastName: lastName.trim(),
            borrowerType,
            program,
            yearLevel,
            section,
            departmentId,
            position,
            employmentStatus:
                employmentStatus || "active",
            tokenHash,
            expiresAt,
        });
    } catch (error) {
        if (error.code === "23505") {
            throw new AppError(
                "School ID or email already exists.",
                409
            );
        }

        if (error.code === "23503") {
            throw new AppError(
                "The selected department does not exist.",
                400
            );
        }

        throw error;
    }

    let emailSent = false;

    try {
        await sendBorrowerInvitation({
            email: borrower.email,
            firstName: borrower.first_name,
            schoolId: borrower.school_id,
            invitationToken: token,
        });

        emailSent = true;
    } catch (error) {
        // The account remains pending. An admin
        // can resend the invitation later.
        console.error(
            "Borrower invitation email failed:",
            error.message
        );
    }

    return {
        borrower,
        emailSent,
        message: emailSent
            ? "Borrower created and invitation email sent."
            : "Borrower created, but the invitation email could not be sent. Please resend the invitation.",
    };
};

const verifyBorrowerInvitation = async (token) => {
    let tokenHash;

    try {
        tokenHash = hashInvitationToken(token);
    } catch {
        throw new AppError(
            "Invalid or expired invitation link.",
            400
        );
    }

    const invitation =
        await findValidInvitation(tokenHash);

    if (!invitation) {
        throw new AppError(
            "Invalid or expired invitation link.",
            400
        );
    }

    return {
        valid: true,
        schoolId: invitation.school_id,
        firstName: invitation.first_name,
        borrowerType: invitation.borrower_type,
    };
};

const acceptBorrowerInvitation = async ({
    token,
    password,
}) => {

    if (
        typeof password !== "string" ||
        password.length < 8 ||
        password.length > 72 ||
        !/[A-Z]/.test(password) ||
        !/[a-z]/.test(password) ||
        !/[0-9]/.test(password)
    ) {
        throw new AppError(
            "Password must be 8 to 72 characters and contain at least one uppercase letter, one lowercase letter, and one number.",
            400
        );
    }


    let tokenHash;

    try {
        tokenHash = hashInvitationToken(token);
    } catch {
        throw new AppError(
            "Invalid or expired invitation link.",
            400
        );
    }

    const passwordHash = await bcrypt.hash(
        password,
        12
    );

    const result = await completeInvitation({
        tokenHash,
        passwordHash,
    });

    if (!result) {
        throw new AppError(
            "Invalid or expired invitation link.",
            400
        );
    }

    return {
        success: true,
        message:
            "Account activated successfully. You can now sign in.",
    };
};

const resendBorrowerInvitation = async (userId) => {
    if (
        !Number.isSafeInteger(Number(userId)) ||
        Number(userId) <= 0
    ) {
        throw new AppError(
            "Invalid borrower ID.",
            400
        );
    }

    const {
        token,
        tokenHash,
        expiresAt,
    } = generateInvitationToken();

    const borrower = await replaceInvitation({
        userId: Number(userId),
        tokenHash,
        expiresAt,
    });

    if (!borrower) {
        throw new AppError(
            "Pending borrower account not found.",
            404
        );
    }

    try {
        await sendBorrowerInvitation({
            email: borrower.email,
            firstName: borrower.first_name,
            schoolId: borrower.school_id,
            invitationToken: token,
        });
    } catch (error) {
        console.error(
            "Resend invitation email failed:",
            error.message
        );

        throw new AppError(
            "The invitation was renewed, but the email could not be sent. Please try resending.",
            502
        );
    }

    return {
        success: true,
        message: "Invitation email sent successfully.",
    };
};

module.exports = {
    createBorrowerInvitation,
    verifyBorrowerInvitation,
    acceptBorrowerInvitation,
    resendBorrowerInvitation,
};

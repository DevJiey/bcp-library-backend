
const nodemailer = require("nodemailer");

const APP_URL = (
    process.env.FRONTEND_URL ||
    "https://bcp-library.vercel.app"
).replace(/\/+$/, "");

function createTransporter() {
    const user = process.env.GMAIL_USER;
    const password = process.env.GMAIL_APP_PASSWORD;

    if (!user || !password) {
        throw new Error(
            "Gmail invitation service is not configured."
        );
    }

    return nodemailer.createTransport({
        service: "gmail",
        auth: {
            user,
            pass: password,
        },
    });
}

function escapeHtml(value) {
    return String(value ?? "").replace(
        /[&<>"']/g,
        (character) => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;",
        })[character]
    );
}

async function sendBorrowerInvitation({
    email,
    firstName,
    schoolId,
    invitationToken,
}) {
    if (
        !email ||
        !firstName ||
        !schoolId ||
        !invitationToken
    ) {
        throw new Error(
            "Missing required borrower invitation details."
        );
    }

    const transporter = createTransporter();

    const setupUrl = new URL(
        "/setup-account",
        APP_URL
    );

    setupUrl.searchParams.set(
        "token",
        invitationToken
    );

    const safeName = escapeHtml(firstName);
    const safeSchoolId = escapeHtml(schoolId);
    const safeUrl = escapeHtml(setupUrl.toString());

    const text = [
        `Hello ${firstName},`,
        "",
        "Your BCP Library borrower account has been created.",
        "",
        `School ID: ${schoolId}`,
        "",
        "Set up your password using this secure link:",
        setupUrl.toString(),
        "",
        "This invitation expires after 24 hours.",
        "The link can only be used once.",
        "",
        "If you did not expect this invitation,",
        "please contact the library administrator.",
        "",
        "BCP Library Management System",
    ].join("\n");

    const html = `
        <div style="
            max-width:560px;
            margin:0 auto;
            padding:32px;
            font-family:Arial,sans-serif;
            color:#1e293b;
            line-height:1.6;
        ">
            <h2 style="color:#0F4C97;">
                BCP Library Management System
            </h2>

            <p>Hello ${safeName},</p>

            <p>
                Your BCP Library borrower account
                has been created.
            </p>

            <p>
                <strong>School ID:</strong>
                ${safeSchoolId}
            </p>

            <p>
                Please set up your password
                to activate your account.
            </p>

            <p style="margin:32px 0;">
                <a href="${safeUrl}" style="
                    display:inline-block;
                    background:#0F4C97;
                    color:#ffffff;
                    padding:13px 24px;
                    border-radius:8px;
                    text-decoration:none;
                    font-weight:bold;
                ">
                    Set Up My Account
                </a>
            </p>

            <p>
                This invitation expires after
                <strong>24 hours</strong>
                and can only be used once.
            </p>

            <p style="font-size:13px;color:#64748b;">
                If you did not expect this invitation,
                please contact the library administrator.
            </p>
        </div>
    `;

    await transporter.sendMail({
        from: {
            name: "BCP Library Management System",
            address: process.env.GMAIL_USER,
        },
        to: email,
        subject: "Activate Your BCP Library Account",
        text,
        html,
    });

    return {
        success: true,
    };
}

module.exports = {
    sendBorrowerInvitation,
};

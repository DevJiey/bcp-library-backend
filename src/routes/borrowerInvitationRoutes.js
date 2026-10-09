
const express = require("express");

const authenticate = require("../middlewares/authenticate");
const authorize = require("../middlewares/authorize");
const validateRequest = require("../middlewares/validateRequest");

const {
    invitationVerificationLimiter,
    invitationAcceptanceLimiter,
} = require("../middlewares/invitationRateLimiter");

const {
    createBorrowerInvitationSchema,
    verifyInvitationSchema,
    acceptInvitationSchema,
} = require("../validators/borrowerInvitationValidator");

const {
    createInvitation,
    verifyInvitation,
    acceptInvitation,
    resendInvitation,
} = require("../controllers/BorrowerInvitationController");

const router = express.Router();

// Admin creates a pending borrower and sends an invitation.
router.post(
    "/borrower-invitations",
    authenticate,
    authorize("admin"),
    validateRequest(createBorrowerInvitationSchema),
    createInvitation
);

// Public: Check whether an invitation link is valid.
router.post(
    "/borrower-invitations/verify",
    invitationVerificationLimiter,
    validateRequest(verifyInvitationSchema),
    verifyInvitation
);

// Public: Set password and activate borrower account.
router.post(
    "/borrower-invitations/accept",
    invitationAcceptanceLimiter,
    validateRequest(acceptInvitationSchema),
    acceptInvitation
);

// Admin resends invitation to a pending borrower.
router.post(
    "/borrower-invitations/:userId/resend",
    authenticate,
    authorize("admin"),
    resendInvitation
);

module.exports = router;

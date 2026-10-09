
const {
    createBorrowerInvitation,
    verifyBorrowerInvitation,
    acceptBorrowerInvitation,
    resendBorrowerInvitation,
} = require("../services/BorrowerInvitationService");

const createInvitation = async (req, res, next) => {
    try {
        const result = await createBorrowerInvitation(
            req.body
        );

        return res.status(201).json({
            success: true,
            ...result,
        });
    } catch (error) {
        next(error);
    }
};

const verifyInvitation = async (req, res, next) => {
    try {
        const result = await verifyBorrowerInvitation(
            req.body.token
        );

        return res.status(200).json({
            success: true,
            ...result,
        });
    } catch (error) {
        next(error);
    }
};

const acceptInvitation = async (req, res, next) => {
    try {
        const result = await acceptBorrowerInvitation({
            token: req.body.token,
            password: req.body.password,
        });

        return res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

const resendInvitation = async (req, res, next) => {
    try {
        const result = await resendBorrowerInvitation(
            req.params.userId
        );

        return res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createInvitation,
    verifyInvitation,
    acceptInvitation,
    resendInvitation,
};

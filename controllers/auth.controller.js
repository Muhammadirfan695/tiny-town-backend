
const asyncHandler = require('express-async-handler');
const { handleResponse } = require('../helpers/response.helper');
const { loginService, loginMagicLink, loginWithMagicLink,
    forgotPasswordService, resetPasswordService, changePasswordService,
    createUserByRoleService } = require('../services/auth.service');


const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const result = await loginService(email, password);
    handleResponse(res, result);
});

const signUp = asyncHandler(async (req, res) => {
    const result = await createUserByRoleService(req.body);
    handleResponse(res, result);
})

const magicLinkLogin = asyncHandler(async (req, res) => {

    const { email } = req.body;
    const result = await loginMagicLink(email);
    handleResponse(res, result);
});
const verifyMagicLinkToLogin = asyncHandler(async (req, res) => {
    const { token } = req.body;
    const result = await loginWithMagicLink(token);
    handleResponse(res, result);
})

const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body
    const result = await forgotPasswordService(email);
    handleResponse(res, result);
})
const resetPassword = asyncHandler(async (req, res) => {
    const { otp, password, confirmPassword } = req.body
    const result = await resetPasswordService(otp, password, confirmPassword);
    handleResponse(res, result);
})

const changePassword = asyncHandler(async (req, res) => {
    const { currentPassword, password, confirmPassword } = req.body
    const { userId } = req
    const result = await changePasswordService(userId, currentPassword, password, confirmPassword);
    handleResponse(res, result);
})
module.exports = {
    login,
    magicLinkLogin,
    verifyMagicLinkToLogin,
    forgotPassword,
    resetPassword,
    changePassword,
    signUp
}
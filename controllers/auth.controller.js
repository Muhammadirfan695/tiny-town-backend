
const asyncHandler = require('express-async-handler');
// const { loginService, signupService, forgotPasswordService, resetPasswordService, changePasswordService, verifyOtpService, resendOtpService } = require('../services/auth.service');
const { handleResponse } = require('../helpers/response.helper');
// const { socialLoginService, socialSignup } = require('../services/socialAuth.service');
const { loginService } = require('../services/auth.service');


const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const result = await loginService(email, password);
    handleResponse(res, result);
});





module.exports = {
    login
}
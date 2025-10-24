
const { verifyPassword, createAuthToken, generateMagicLink } = require("../helpers/auth.helper");
const { success, error } = require("../helpers/response.helper");
const { passwordsMatch } = require("../helpers/validation.helper");
const { generateOTP } = require("../utils");
const { sendMagicLink, sendOTPtoResetPassword } = require("./email.service");
const { getUserRole } = require("./role.service");
const { isActive, findByEmail, generateMagicToken, findByMagicLink, clearMagicLinkToken, generateUserResetToken, findUserByResetToken, updateUserPassword, findUserById } = require("./user.service");



const loginService = async (email, password) => {
    if (!email || !password) {
        return error("Email and Password are Required", 400);
    }

    const user = await findByEmail(email);
    if (!user) {
        return error("Invalid Credentials", 404);
    }

    if (!isActive(user)) {
        return error("User is Not Active", 403);
    }

    const match = await verifyPassword(password, user.password);
    if (!match) {
        return error("Invalid Credentials", 403);
    }

    const roleName = await getUserRole(user.id);
    const token = createAuthToken(user.id, roleName);

    const { password: _, ...userData } = user.toJSON();
    return success("Login Successfully", {
        user: {
            ...userData,
            role: roleName,
            token,
        },
    });
};

const loginMagicLink = async (email) => {
    if (!email) {
        return error("Email is Required", 400);
    }
    try {
        const token = await generateMagicToken(email);
        const link = generateMagicLink(token);
        await sendMagicLink(email, link);
        return success("Magic Link Sent Successfully", link);
    } catch (err) {
        console.error(err);
        return error(err.message || "Failed to send magic link", 500);
    }
}


const loginWithMagicLink = async (token) => {
    if (!token) {
        return error("Magic token is required", 400);
    }

    const user = await findByMagicLink(token)

    if (!user) {
        return error("Invalid or expired magic link", 400);
    }
    await clearMagicLinkToken(user)
    const roleName = await getUserRole(user.id);
    const authToken = createAuthToken(user.id, roleName);
    const { password: _, ...userData } = user.toJSON();
    return success("Login Successfully", {
        user: {
            ...userData,
            role: roleName,
            token: authToken,
        },
    });
};

const forgotPasswordService = async (email) => {
    if (!email) {
        return error("Email is required", 400);
    }
    const user = await findByEmail(email);
    if (!user) {
        return error("No User Found", 404);
    }
    const otp = generateOTP();
    const expires = new Date(Date.now() + 10 * 60 * 1000);
    await generateUserResetToken(user, otp, expires);

    await sendOTPtoResetPassword(email, otp);
    return success("OTP sent successfully", otp);
}


const resetPasswordService = async (otp, password, confirmPassword) => {
    try {
        if (!otp || !password || !confirmPassword) {
            return error("Otp, Password and Confirm Password are required", 400);
        }
        const user = await findUserByResetToken(otp);
        if (!user) {
            return error("Invalid or expired Token", 400);
        }

        const isMatch = passwordsMatch(password, confirmPassword);
        if (!isMatch) {
            return error("Password and Confirm Password do not match", 400);
        }

        await updateUserPassword(user, password);

        return success("Password reset successfully", 200);
    } catch (err) {
        console.error("resetPasswordService error:", err);
        return error("Something went wrong", 500);
    }
};

const changePasswordService = async (id, currentPassword, password, confirmPassword) => {
    try {
        if (!currentPassword, !password || !confirmPassword) {
            return error("Current Password, Password and Confirm Password are required", 400);
        }
        const user = await findUserById(id);
        if (!user) {
            return error("No User Found", 404);
        }
        const match = await verifyPassword(currentPassword, user.password);
        if (!match) {
            return error("Invalid Password", 403);
        }
        const isMatch = passwordsMatch(password, confirmPassword);
        if (!isMatch) {
            return error("Password and Confirm Password do not match", 400);
        }

        await updateUserPassword(user, password);

        return success("Password reset successfully", 200);
    } catch (err) {
        console.error("resetPasswordService error:", err);
        return error("Something went wrong", 500);
    }
};

module.exports = {
    loginService,
    loginMagicLink,
    loginWithMagicLink,
    forgotPasswordService,
    resetPasswordService,
    changePasswordService
}
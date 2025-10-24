
const { verifyPassword, createAuthToken } = require("../helpers/auth.helper");
const { success, error } = require("../helpers/response.helper");
const { getUserRole } = require("./role.service");
const { findByEmail } = require("./user.service");

loginService = async (email, password) => {
    try {
        if (!email || !password) {
            return error("Email and Password are Required", 400);
        }

        const user = await findByEmail(email);
        if (!user) {
            return error("Invalid Credentials", 401);
        }

        if (user.status !== 'active') {
            return error("User is Not Active", 403);
        }

        const match = await verifyPassword(password, user.password);
        if (!match) {
            return error("Invalid Credentials", 401);
        }

        const roleName = await getUserRole(user.id);
        if (!roleName) {
            return error("User role not found.", 500);
        }

        const token = createAuthToken(user.id, roleName);

        const { password: _, ...userData } = user.toJSON();

        return success("Login Successfully", {
            user: {
                ...userData,
                role: roleName,
                token,
            },
        });

    } catch (e) {
        console.error("!!! LOGIN SERVICE CRASHED !!!", e);
        return error("An internal server error occurred.", 500);
    }
};

module.exports = {
    loginService
}
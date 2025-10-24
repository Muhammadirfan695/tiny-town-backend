
const { verifyPassword, createAuthToken } = require("../helpers/auth.helper");
const { success, error } = require("../helpers/response.helper");
const { getUserRole } = require("./role.service");
const { isActive, findByEmail } = require("./user.service");

loginService = async (email, password) => {
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

module.exports = {
    loginService
}
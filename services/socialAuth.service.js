const { success, error } = require("../helpers/response.helper");
const { generateToken, MESSAGE_LIST } = require("../utils");
const { findByProvider, findByEmail, emailExists } = require("./user.service");
const { getAllUserRolesById, getRoleByName } = require("./role.service");
const { verifySocialToken } = require("../utils/socialVerifier");
const { sequelize } = require("../models");

exports.socialLoginService = async (token, provider, lang = "en") => {
  if (!token || !provider) {
    return error('Token and Provider are Required', 400);
  }

  try {
    const userData = await verifySocialToken(provider.toLowerCase(), token);
    if (!userData?.email) {
      return error('Invalid Credentials', 400);
    }

    const email = userData.email.trim().toLowerCase();

    let user = await findByProvider(provider, userData.id);
    if (!user) {
      user = await findByEmail(email);
      if (!user) {
        return error('User Not Found', 404);
      }
    }

    const roleName = await getAllUserRolesById(user.id);

    const jwtToken = generateToken(user.id, roleName);

    const userJson = user.toJSON();
    if (userJson.avatar && !/^https?:\/\//i.test(userJson.avatar)) {
      userJson.avatar = `${process.env.CLIENT_URL}${userJson.avatar}`;
    }

    return success("Social Login Successfull", {
      user: {
        ...userJson,
        role: roleName,
        token: jwtToken,
      },
    });
  } catch (err) {
    console.error("Social login error:", err);
    return error("Social Login Failed", 500);
  }
};

exports.socialSignup = async (roleName, token, provider, lang = "en") => {
  if (!token || !provider) {
    return error('Token and Provider are Required', 400);
  }

  try {
    const userData = await verifySocialToken(provider, token);
    if (!userData) {
      return error("Invalid Value of Provider", 400);
    }
    if (!userData.email) {
      return error("Invalid Credentials", 400);
    }

    const email = userData.email.trim().toLowerCase();

    const existingProviderUser = await findByProvider(provider, userData.id);
    if (existingProviderUser) {
      return error("User Already Exist", 400);
    }

    const hasEmail = await emailExists(email);
    if (hasEmail) {
      return error("User Already Exist", 400);
    }

    const role = await getRoleByName(roleName);
    if (!role) {
      return error(
        `Invalid ${roleName}`,
        400
      );
    }

    const transaction = await sequelize.transaction();
    let user;

    try {
      user = await createUser(
        {
          firstName: userData.firstName || null,
          lastName: userData.lastName || null,
          email,
          avatar: userData.image || userData.avatar || null,
          provider,
          provider_id: userData.id,
          status: "active",
        },
        transaction
      );
      await assignRole(user.id, role.id, transaction);
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      console.error("Transaction failed:", err);
      return error("Social Sign Up Failed", 500);
    }
    const jwtToken = generateToken(user.id, role.name);
    const userJson = user.toJSON();
    return success("Social Sign Up Successfull", {
      user: {
        ...userJson,
        role: role.name,
        token: jwtToken,
      },
    });
  } catch (err) {
    console.error("Social signup error:", err);
    return error("Social Sign Up Failed", 500);
  }
};
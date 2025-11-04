const {
  verifyPassword,
  createAuthToken,
  generateMagicLink,
} = require("../helpers/auth.helper");
const { success, error } = require("../helpers/response.helper");
const { passwordsMatch } = require("../helpers/validation.helper");
const { sequelize, Role, Attachment, Restaurant } = require("../models");
const { sendMagicLink, sendOTPtoResetPassword } = require("./email.service");
const {
  getRoleByName,
  assignRole,
  getAllUserRolesById,
} = require("./role.service");
const { Op } = require("sequelize");
const { User } = require("../models");
const {
  isActive,
  findByEmail,
  generateMagicToken,
  findByMagicLink,
  clearMagicLinkToken,
  generateUserResetToken,
  findUserByResetToken,
  updateUserPassword,
  findUserById,
  emailExists,
  createUser,
  createOtpWithExpiry,
} = require("./user.service");
const bcrypt = require("bcrypt");
loginService = async (email, password) => {
  try {
    if (!email || !password) {
      return error("Email and Password are Required", 400);
    }

    const user = await User.findOne({
      where: { email: email },
      attributes: { exclude: ["createdAt", "updatedAt"] },
      include: [{
        model: Role, as: "Roles", attributes: { exclude: ["createdAt", "updatedAt"] },
        through: { attributes: [] }
      },
      { model: Restaurant, as: 'OwnedRestaurants' },
      { model: Restaurant, as: 'ManagedRestaurants' },
      { model: Attachment, as: "attachments", attributes: { exclude: ["createdAt", "updatedAt"] } }],


    });
    if (!user) {
      return error("Invalid Credentials", 401);
    }

    if (user.status !== "active") {
      return error("User is Not Active", 403);
    }

    const match = await verifyPassword(password, user.password);
    if (!match) {
      return error("Invalid Credentials", 401);
    }
    const roleNames = await getAllUserRolesById(user.id); // This returns ["Admin"]

    // 2. Get the FIRST role from the array.
    const primaryRole = roleNames?.[0]; // This will be the string "Admin"

    if (!primaryRole) {
      return error("User has no assigned role.", 500);
    }

    // 3. Create the token with the SIMPLE STRING.
    const token = createAuthToken(user.id, primaryRole);
    // ------------------------------------

    const { password: _, ...userData } = user.toJSON();

    return success("Login Successfully", {
      user: {
        ...userData,
        role: primaryRole, // Return the simple string to the frontend
        token,
      },
    });
  } catch (e) {
    console.error("!!! LOGIN SERVICE CRASHED !!!", e);
    return error("An internal server error occurred.", 500);
  }
  // const roleName = await getAllUserRolesById(user.id);
  // const token = createAuthToken(user.id, roleName);

  //     const { password: _, ...userData } = user.toJSON();

  //     return success("Login Successfully", {
  //         user: {
  //             ...userData,
  //             role: roleName,
  //             token,
  //         },
  //     });

  // } catch (e) {
  //     console.error("!!! LOGIN SERVICE CRASHED !!!", e);
  //     return error("An internal server error occurred.", 500);
  // }
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
};

// const loginWithMagicLink = async (token) => {
//     if (!token) {
//         return error("Magic token is required", 400);
//     }

//     const user = await findByMagicLink(token)

//     if (!user) {
//         return error("Invalid or expired magic link", 400);
//     }
//     await clearMagicLinkToken(user)
//     const roleName = await getAllUserRolesById(user.id);
//     const authToken = createAuthToken(user.id, roleName);
//     const { password: _, ...userData } = user.toJSON();
//     return success("Login Successfully", {
//         user: {
//             ...userData,
//             role: roleName,
//             token: authToken,
//         },
//     });
// };

const loginWithMagicLink = async (token) => {
  const { error, success } = require("../helpers/response.helper");
  const { clearMagicLinkToken } = require("./user.service");

  if (!token) {
    return error("Magic token is required", 400);
  }

  try {
    const user = await User.findOne({
      where: {
        magicLoginToken: token,
        magicLoginTokenExpires: { [Op.gt]: new Date() },
      },
      include: [
        { model: Restaurant, as: 'OwnedRestaurants' },
        { model: Restaurant, as: 'ManagedRestaurants' },
      ],
    });

    if (!user) {
      return error("Invalid or expired magic link", 400);
    }

    await clearMagicLinkToken(user);

    const roleNames = await getAllUserRolesById(user.id);
    const primaryRole = roleNames?.[0];

    if (!primaryRole) {
      return error("User has no assigned role.", 500);
    }

    const authToken = createAuthToken(user.id, primaryRole);

    const { password: _, ...userData } = user.toJSON();

    return success("Login Successfully", {
      user: {
        ...userData,
        role: primaryRole,
        token: authToken,
      },
    });
  } catch (e) {
    console.error("!!! MAGIC LINK LOGIN CRASHED !!!", e);
    return error("An internal server error occurred.", 500);
  }
};
const forgotPasswordService = async (email) => {
  if (!email) {
    return error("Email is required", 400);
  }
  const user = await findByEmail(email);
  if (!user) {
    return error("No User Found", 404);
  }

  const { otp, expires } = createOtpWithExpiry();
  await generateUserResetToken(user, otp, expires);

  await sendOTPtoResetPassword(email, otp);
  return success("OTP sent successfully", otp);
};

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

const changePasswordService = async (
  id,
  currentPassword,
  password,
  confirmPassword
) => {
  try {
    if (!password || !confirmPassword) {
      return error("New Password and Confirm Password are required", 400);
    }

    const user = await findUserById(id);
    if (!user) {
      return error("User not found", 404);
    }


    if (user.password) {
      const isMatch = await verifyPassword(currentPassword, user.password);
      if (!isMatch) {
        return error("Your current password is incorrect.", 403);
      }
    }

    const doPasswordsMatch = passwordsMatch(password, confirmPassword);
    if (!doPasswordsMatch) {
      return error("New password and confirmation do not match.", 400);
    }

    await updateUserPassword(user, password);

    return success("Password changed successfully", 200);

  } catch (err) {
    console.error("changePasswordService error:", err);
    return error("An internal server error occurred.", 500);
  }
};

// const changePasswordService = async (id, currentPassword, newPassword, confirmPassword) => {
//     try {
//         if (!currentPassword || !newPassword || !confirmPassword) {
//             return error("All password fields are required", 400);
//         }

//         const user = await findUserById(id);
//         if (!user) {
//             return error("User not found", 404);
//         }

//         // Use bcrypt.compare directly for clarity and safety
//         const isCurrentPasswordCorrect = await bcrypt.compare(currentPassword, user.password);
//         if (!isCurrentPasswordCorrect) {
//             return error("Your current password is incorrect.", 403);
//         }

//         if (!passwordsMatch(newPassword, confirmPassword)) {
//             return error("New password and confirmation do not match.", 400);
//         }

//         // The user model's 'beforeUpdate' hook will automatically hash the new password
//         user.password = newPassword;
//         await user.save();

//         return success("Password changed successfully!", 200);

//     } catch (err) {
//         console.error("!!! changePasswordService CRASHED !!!", err);
//         return error("An internal server error occurred.", 500);
//     }
// };

const createUserService = async (data) => {
  try {
    if (!data.firstName || !data.lastName || !data.email || !data.role) {
      return error("First Name, Last Name, Email and Role are Required", 400);
    }

    const existingUser = await emailExists(data.email);
    if (existingUser) {
      return error("User already exists", 400);
    }

    const role = await getRoleByName(data.role);
    if (!role) {
      return error(`Role "${data.role}" does not exist`, 400);
    }

    const user = await createUser(data);

    await assignRole(user.id, role.id);

    const token = await generateMagicToken(user.email);

    const link = generateMagicLink(token);

    await sendMagicLink(user.email, link);

    const { password, ...userData } = user.toJSON();

    return success("User created and Magic Link Sent Successfully", {
      user: userData,
      link: link,
    });
    // return success("User created and Magic Link Sent Successfully", { link });
  } catch (err) {
    console.error(err);
    return error(err.message || "Failed to create user", 500);
  }
};

module.exports = {
  loginService,
  loginMagicLink,
  loginWithMagicLink,
  forgotPasswordService,
  resetPasswordService,
  changePasswordService,
  createUserService,
};

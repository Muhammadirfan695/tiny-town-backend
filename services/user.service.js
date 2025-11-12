const { Op } = require("sequelize");
const { User, Role, sequelize, Attachment, Restaurant } = require("../models");
const { generateOTP } = require("../utils");
const { v4: uuidv4 } = require('uuid');
const { error, success } = require("../helpers/response.helper");
const { sendOTPtoResetPassword, sendOTPtoVerify } = require("./email.service");
const { findOneAttachment, createAttachment, deleteAttachment, findAllAttachments } = require("./attachment.service");
const { removeUserRole, getAllRoleByIds } = require("./role.service");



const findByEmail = async (email) => {
  if (!email) return null;

  const sanitizedEmail = email.trim().toLowerCase();

  return await User.findOne({
    where: { email: sanitizedEmail },
    attributes: { exclude: ["createdAt", "updatedAt"] },
    include: [{ model: Role, as: "Roles", attributes: { exclude: ["createdAt", "updatedAt"] }, through: { attributes: [] } },
    { model: Restaurant, as: 'OwnedRestaurants' },
    { model: Restaurant, as: 'ManagedRestaurants' },
    { model: Attachment, as: "attachments", attributes: { exclude: ["createdAt", "updatedAt"] } }],


  });
};

const findUserById = async (id, transaction = null) => {
  return await User.findByPk(id, {
    attributes: { exclude: ["createdAt", "updatedAt"] },
    include: [{ model: Role, as: "Roles", attributes: { exclude: ["createdAt", "updatedAt"] }, through: { attributes: [] } },
    { model: Restaurant, as: 'OwnedRestaurants' },
    { model: Restaurant, as: 'ManagedRestaurants' },
    { model: Attachment, as: "attachments", attributes: { exclude: ["createdAt", "updatedAt"] } }],
    transaction,
  });
};

const createOtpWithExpiry = () => {
  const otp = generateOTP();
  const expires = new Date(Date.now() + 10 * 60 * 1000); 
  return { otp, expires };
};

const generateMagicToken = async (email) => {
  const user = await findByEmail(email);
  if (!user) {
    return error("Invalid Credentials", 404);
  }
  const token = uuidv4();
  const expires = new Date(Date.now() + 10 * 60 * 1000);

  user.magicLoginToken = token;
  user.magicLoginTokenExpires = expires;
  await user.save();
  return token;
};

const findByMagicLink = async (token, transaction = null) => {
  if (!token) {
    return error("Token is Required", 400);
  }
  return await User.findOne({
    where: {
      magicLoginToken: token,
      magicLoginTokenExpires: { [Op.gt]: new Date() },
    },
    attributes: { exclude: ["createdAt", "updatedAt"] },
    include: [{ model: Role, as: "Roles", attributes: { exclude: ["createdAt", "updatedAt"] }, through: { attributes: [] } },
    { model: Attachment, as: "attachments", attributes: { exclude: ["createdAt", "updatedAt"] } }],


  }, { transaction });
}

const clearMagicLinkToken = async (user) => {
  user.magicLoginToken = null;
  user.magicLoginTokenExpires = null;
  return await user.save();
};


const generateUserResetToken = async (user, token, expires, transaction) => {
  user.resetPasswordToken = token;
  user.resetPasswordExpire = expires;
  return await user.save({ transaction });
};

const clearUserResetToken = async (user) => {
  user.resetPasswordToken = null;
  user.resetPasswordExpire = null;
  return await user.save();
};

const generateUserVerifyOtp = async (user, otp, expires, transaction) => {
  user.otp = otp;
  user.otpExpires = expires;
  return await user.save({ transaction });
};

const clearUserOtp = async (user) => {
  user.otp = null;
  user.otpExpires = null;
  return await user.save();
};

const findUserByResetToken = async (otp, transaction) => {
  return await User.findOne({
    where: {
      resetPasswordToken: otp,
      resetPasswordExpire: { [Op.gt]: Date.now() },
    },
    transaction,
  });
};

const updateUserPassword = async (user, newPassword, transaction) => {
  user.password = newPassword;
  user.resetPasswordToken = null;
  user.resetPasswordExpire = null;
  await user.save({ transaction });
  return user;
};

const isActive = (user) => user.status === "active";

const emailExists = async (email, transaction = null) => {
  if (!email) return false;
  const existing = await User.findOne({ where: { email: email.toLowerCase() }, transaction });
  return !!existing;
};
const createUser = async (data, transaction) => {
  return await User.create(data, { transaction });
};










exports.findByProvider = async (provider, providerId) => {
  if (!provider || !providerId) return null;

  return await User.findOne({
    where: { provider, provider_id: providerId },
    attributes: { exclude: ["createdAt", "updatedAt"] },
  });
};

exports.updateUserResetToken = async (user, otp, expires, transaction) => {
  user.resetPasswordToken = otp;
  user.resetPasswordExpire = expires;
  return await user.save({ transaction });
};

exports.updateUserVerificationToken = async (user, otp, expires, transaction) => {
  await user.update(
    {
      otp: otp,
      otpExpires: expires,
    },
    { transaction }
  );
};









const findAllAndCountUser = async (
  where = {}, limit = 10, offset = 0, paranoid, transaction = null
) => {
  return await User.findAndCountAll({
    where,
    include: [{ model: Role, as: "Roles", attributes: { exclude: ["createdAt", "updatedAt"] }, through: { attributes: [] } },
    { model: Attachment, as: "attachments", attributes: { exclude: ["createdAt", "updatedAt"] } }],
    // include: [
    //   {
    //     model: Role,
    //     as: "Roles",
    //     attributes: ["id", "name"],
    //     through: { attributes: [] },
    //   },
    // ],
    order: [["createdAt", "DESC"]],
    limit,
    offset,
    distinct: true,
    paranoid,
    transaction,
  });
}


const getAllUsersService = async (query) => {
  const transaction = await sequelize.transaction();
  try {
    let {
      page = 1,
      limit = 10,
      status,
      verified,
      firstName,
      lastName,
      email,
      deleted
    } = query;

    page = parseInt(page);
    limit = parseInt(limit);
    const offset = (page - 1) * limit;

    const where = {};

    if (status) where.status = status;
    if (verified !== undefined)
      where.verified = verified === "true" || verified === true;
    if (firstName)
      where.firstName = { [Op.iLike]: `%${firstName.trim()}%` };
    if (lastName)
      where.lastName = { [Op.iLike]: `%${lastName.trim()}%` };
    if (email)
      where.email = { [Op.iLike]: `%${email.trim()}%` };

    let paranoid = true;
    if (deleted === "true" || deleted === true) {
      paranoid = false;
      where.deletedAt = { [Op.ne]: null };
    }

    const usersWithRoles = await User.findAll({
      where,
      include: [
        {
          model: Role,
          as: "Roles",
          attributes: ["name"],
          through: { attributes: [] },
        },
      ],
      attributes: {
        exclude: ["password", "resetPasswordToken",
          "resetPasswordExpire", "otp",
          "otpExpires", "magicLoginToken", "magicLoginTokenExpires",
          "createdAt", "updatedAt"]
      },
      offset,
      limit,
      paranoid,
      transaction,
    });

    const filteredUsers = usersWithRoles.filter(user => {
      const roleNames = user.Roles.map(r => r.name.toLowerCase());
      return !(roleNames.length === 1 && roleNames[0] === "admin");
    });

    await transaction.commit();

    return success("Users fetched successfully", {
      data: {
        users: filteredUsers,
        total: filteredUsers.length,
        page,
        limit,
        totalPages: Math.ceil(filteredUsers.length / limit),
      },
    });
  } catch (err) {
    console.error("getAllUsersService error:", err);
    await transaction.rollback();
    return error("Failed to fetch users", 400);
  }
};


const deleteUserService = async (userId, { hardDelete = false } = {}) => {
  const transaction = await sequelize.transaction();

  try {
    const user = await findUserById(userId, transaction)

    if (!user) {
      await transaction.rollback();
      return error("User not found", 404);
    }

    if (!hardDelete) {
      await user.update({ status: "inactive" }, { transaction });
      await user.destroy({ transaction });
      await transaction.commit();

      return success("User soft-deleted successfully", { data: { id: user.id } });
    }


    const avatarAttachment = await findOneAttachment(user.id, "User", "avatar", transaction);
    if (avatarAttachment) {
      await deleteAttachment(avatarAttachment, transaction);
    }

    const userAttachments = await findAllAttachments(user.id, "User", transaction)


    for (const attachment of userAttachments) {
      await deleteAttachment(attachment, transaction);
    }

    await removeUserRole(user.id, null, transaction)

    await user.destroy({ transaction });

    await transaction.commit();
    return success("User permanently deleted", { data: { id: user.id } });
  } catch (err) {
    console.error("deleteUserService error:", err);
    await transaction.rollback();
    return error("Failed to delete user", 400);
  }
};

const restoreUserService = async (userId) => {
  const transaction = await sequelize.transaction();

  try {
    const user = await User.findOne({
      where: { id: userId },
      paranoid: false,
      transaction,
    });

    if (!user) {
      await transaction.rollback();
      return error("User not found", 404);
    }

    if (!user.deletedAt) {
      await transaction.rollback();
      return error("User is not deleted", 400);
    }

    await user.restore({ transaction });

    await user.update({ status: "active" }, { transaction });

    await transaction.commit();

    return success("User restored successfully", { data: { id: user.id } });
  } catch (err) {
    console.error("restoreUserService error:", err);
    await transaction.rollback();
    return error("Failed to restore user", 400);
  }
};


const updateUserProfileService = async (data, file = null) => {
  const transaction = await sequelize.transaction();

  try {
    const { id } = data;
    const user = await findUserById(id, transaction);

    if (!user) {
      await transaction.rollback();
      return error("No User Found", 400);
    }

    const { roles, email, ...userData } = data;

    console.log("req.file", roles)
    if (user.provider === "local") {
      if (email && email !== user.email) {
        userData.email = email;
        userData.verified = false;
      } else {
        userData.email = user.email;
      }
    } else {
      delete userData.email;
    }


    await User.update(userData, { where: { id }, transaction })

    if (roles && (Array.isArray(roles) || typeof roles === "string")) {
      const roleIds = Array.isArray(roles)
        ? roles
        : roles.split(",").map((r) => r.trim());
      const existingRoles = await getAllRoleByIds(roleIds, transaction);
      console.log("rolesrolesroles", existingRoles);

      if (existingRoles.length !== roleIds.length) {
        await transaction.rollback();
        return error("One or more roles are invalid", 400);
      }

      const updatedUserInstance = await findUserById(id, transaction);
      await updatedUserInstance.setRoles(roleIds, { transaction });
    }

    if (file) {
      const existingAvatar = await findOneAttachment(user.id, "User", "avatar", transaction);
      if (existingAvatar) {
        await deleteAttachment(existingAvatar, transaction);
      }
      console.log(file, "file----", file.path)
      await createAttachment(
        user.id,
        "User",
        "avatar",
        file.path,
        file.filename,
        transaction
      );
    }

    await transaction.commit();


    if (user.provider === "local" && email && email !== user.email) {
      const { otp, expires } = createOtpWithExpiry();
      await generateUserVerifyOtp(user, otp, expires);
      await sendOTPtoVerify(email, otp);
    }

    const updatedUser = await findUserById(id);
    return success("User updated successfully", { data: updatedUser });

  } catch (err) {
    console.error("updateUserProfileService error:", err);
    await transaction.rollback();
    return error("Failed to update user", 400);
  }
};

const updateUserService = async (data, file = null) => {
  const transaction = await sequelize.transaction();

  try {
    const { id } = data;
    const user = await findUserById(id, transaction);

    if (!user) {
      await transaction.rollback();
      return error("No User Found", 400);
    }

    const { roles, email, ...userData } = data;

    if (user.provider === "local") {
      if (email && email !== user.email) {
        userData.email = email;
        userData.verified = false;
      } else {
        userData.email = user.email;
      }
    } else {
      delete userData.email;
    }


    await User.update(userData, { where: { id }, transaction })

    if (roles && (Array.isArray(roles) || typeof roles === "string")) {
      const roleIds = Array.isArray(roles)
        ? roles
        : roles.split(",").map((r) => r.trim());
      const existingRoles = await getAllRoleByIds(roleIds, transaction);

      if (existingRoles.length !== roleIds.length) {
        await transaction.rollback();
        return error("One or more roles are invalid", 400);
      }

      const updatedUserInstance = await findUserById(id, transaction);
      await updatedUserInstance.setRoles(roleIds, { transaction });
    }

    if (file) {
      const existingAvatar = await findOneAttachment(user.id, "User", "avatar", transaction);

      if (existingAvatar) {
        await deleteAttachment(existingAvatar, transaction);
      }

      await createAttachment(
        user.id,
        "User",
        "avatar",
        file.path,
        file.filename,
        transaction
      );
    }

    await transaction.commit();

    const updatedUser = await findUserById(id);
    return success("User updated successfully", { data: updatedUser });

  } catch (err) {
    console.error("updateUserProfileService error:", err);
    await transaction.rollback();
    return error("Failed to update user", 400);
  }
};
module.exports = {
  generateMagicToken, findByEmail,
  findUserById, findByMagicLink,
  generateUserResetToken, clearMagicLinkToken,
  clearUserResetToken, findUserByResetToken,
  updateUserPassword, isActive,
  emailExists, createUser, createOtpWithExpiry,
  updateUserProfileService, deleteUserService, getAllUsersService, findAllAndCountUser,
  clearUserOtp, updateUserService, restoreUserService
}
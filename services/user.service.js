const { Op } = require("sequelize");
const { User } = require("../models");
const { generateOTP } = require("../utils");
const { v4: uuidv4 } = require('uuid');
const findByEmail = async (email) => {
  if (!email) return null;

  const sanitizedEmail = email.trim().toLowerCase();

  return await User.findOne({
    where: { email: sanitizedEmail },
    attributes: { exclude: ["createdAt", "updatedAt"] },
  });
};

const findUserById = async (id, transaction = null) => {
  return await User.findByPk(id, { transaction });
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

exports.findByProvider = async (provider, providerId) => {
  if (!provider || !providerId) return null;

  return await User.findOne({
    where: { provider, provider_id: providerId },
    attributes: { exclude: ["createdAt", "updatedAt"] },
  });
};

exports.emailExists = async (email) => {
  if (!email) return false;
  const existing = await User.findOne({ where: { email: email.toLowerCase() } });
  return !!existing;
};



exports.createUser = async (data, transaction) => {
  return await User.create(data, { transaction });
};

exports.updateUserResetToken = async (user, otp, expires, transaction) => {
  user.resetPasswordToken = otp;
  user.resetPasswordExpire = expires;
  return await user.save({ transaction });
};



exports.createOtpWithExpiry = () => {
  const otp = generateOTP();
  const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 min
  return { otp, expires };
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



module.exports = {
  generateMagicToken, findByEmail,
  findUserById, findByMagicLink,
  generateUserResetToken, clearMagicLinkToken,
  clearUserResetToken, findUserByResetToken,
  updateUserPassword,isActive
}
const { Op } = require("sequelize");
const { User } = require("../models");
const { generateOTP } = require("../utils");

findByEmail = async (email) => {
  if (!email) return null;

  const sanitizedEmail = email.trim().toLowerCase();

  return await User.findOne({
    where: { email: sanitizedEmail },
    attributes: { exclude: ["createdAt", "updatedAt"] },
  });
};
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


exports.isActive = (user) => user.status === "active";

exports.createUser = async (data, transaction) => {
  return await User.create(data, { transaction });
};

exports.updateUserResetToken = async (user, otp, expires, transaction) => {
  user.resetPasswordToken = otp;
  user.resetPasswordExpire = expires;
  return await user.save({ transaction });
};

exports.clearUserResetToken = async (user) => {
  user.resetPasswordToken = null;
  user.resetPasswordExpire = null;
  return await user.save();
};

exports.createOtpWithExpiry = () => {
  const otp = generateOTP();
  const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 min
  return { otp, expires };
};

exports.findUserByResetToken = async (otp, transaction) => {
  return await User.findOne({
    where: {
      resetPasswordToken: otp,
      resetPasswordExpire: { [Op.gt]: Date.now() },
    },
    transaction,
  });
};

exports.updateUserPassword = async (user, newPassword, transaction) => {
  user.password = newPassword;
  user.resetPasswordToken = null;
  user.resetPasswordExpire = null;
  await user.save({ transaction });
  return user;
};


exports.findUserById = async (id, transaction = null) => {
  return await User.findByPk(id, { transaction });
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



module.exports = { findByEmail }
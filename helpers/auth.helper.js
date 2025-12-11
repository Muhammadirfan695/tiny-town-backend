const bcrypt = require('bcrypt');
const { generateToken } = require("../utils");

const verifyPassword = async (plain, hash) => {
  return bcrypt.compare(plain, hash);
};

const createAuthToken = (userId, role, tokenTime = '1d' ) => {
  return generateToken(userId, role, tokenTime);
};

const generateMagicLink = (token) => {
  const client_url = process.env.CLIENT_URL
  return `${client_url}?token=${token}`;
}


module.exports = {
  verifyPassword,
  createAuthToken,
  generateMagicLink
}
const bcrypt = require('bcrypt');
const { generateToken } = require("../utils");

const verifyPassword = async (plain, hash) => {
  return bcrypt.compare(plain, hash);
};

const createAuthToken = (userId, role) => {
  return generateToken(userId, role);
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
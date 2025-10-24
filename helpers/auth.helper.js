const bcrypt = require('bcrypt');
const { generateToken } = require("../utils");

verifyPassword = async (plain, hash) => {
  return bcrypt.compare(plain, hash);
};

createAuthToken = (userId, role) => {
  return generateToken(userId, role);
};

module.exports = {
  verifyPassword,
  createAuthToken
}
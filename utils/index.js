const jwt = require('jsonwebtoken');

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString()
};

const generateToken = (id, role, tokenTime = '1d' ) => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET,
    { expiresIn: tokenTime }
  );
};

module.exports = {
  generateOTP,
  generateToken
}
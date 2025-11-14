const jwt = require('jsonwebtoken');

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString()
};

const generateToken = (id, role) => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET,
    { expiresIn: '10s' }
  );
};

module.exports = {
  generateOTP,
  generateToken
}
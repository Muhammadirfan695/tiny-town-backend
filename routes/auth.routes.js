const express = require("express");
const { login, magicLinkLogin, verifyMagicLinkToLogin, forgotPassword, resetPassword, changePassword, signUp } = require("../controllers/auth.controller");
const { apiKeyAuth, protect } = require("../middleware/authMiddleware");
const router = express.Router();

router.post('/login', apiKeyAuth, login);
router.post('/signup', apiKeyAuth, signUp);
router.post('/magic-link', apiKeyAuth, magicLinkLogin);
router.post('/magic-login', apiKeyAuth, verifyMagicLinkToLogin);
router.post('/forgot-password', apiKeyAuth, forgotPassword);
router.post('/reset-password', apiKeyAuth, resetPassword);
router.post('/change-password', apiKeyAuth, protect, changePassword);
module.exports = router;
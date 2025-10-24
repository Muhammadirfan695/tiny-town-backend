const express = require("express");
const { login } = require("../controllers/auth.controller");
const { apiKeyAuth } = require("../middleware/authMiddleware");
const router = express.Router();


router.post('/login', apiKeyAuth ,login);

module.exports = router;
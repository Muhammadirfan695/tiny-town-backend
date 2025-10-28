const express = require("express");
const { upload } = require('../utils/uploadImage');
const { apiKeyAuth, protect } = require("../middleware/authMiddleware");
const { updateProfile, getProfile } = require("../controllers/user.controller");
const router = express.Router();


router.get('/profile',  apiKeyAuth, protect, getProfile);
router.patch('/profile', upload.single("file"), apiKeyAuth, protect, updateProfile);

module.exports = router;
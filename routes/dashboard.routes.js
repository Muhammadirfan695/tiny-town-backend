const express = require('express');
const { apiKeyAuth, authorize } = require('../middleware/authMiddleware');
const { getDashboardStats } = require('../controllers/dashboard.controller');

const router = express.Router();

router.get("/stats",
    apiKeyAuth, authorize('Admin', 'Manager', 'Owner'),
    getDashboardStats);
module.exports = router;
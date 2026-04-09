const express = require('express');
const router = express.Router();
const ttController = require('../controllers/tinytown.controller');
const { apiKeyAuth } = require('../middlewares/auth.middleware');

// Public Routes (Sirf x-api-key chahiye)
router.get('/products', apiKeyAuth, ttController.getProducts);
router.post('/orders', apiKeyAuth, ttController.createOrder);

// Admin Routes (Demo ke liye sirf x-api-admin-key check karega)
router.post('/products', apiKeyAuth, ttController.createProduct);
router.get('/orders', apiKeyAuth, ttController.getOrders);

module.exports = router;
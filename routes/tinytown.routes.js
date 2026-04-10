const express = require('express');
const router = express.Router();

// In-memory storage for demo (no DB required)
let products = [
  { id: 1, name: "Kids T-Shirt", price: 599, image: "https://via.placeholder.com/300", isNew: true },
  { id: 2, name: "Baby Dress", price: 899, image: "https://via.placeholder.com/300", isNew: false },
  { id: 3, name: "Winter Jacket", price: 1299, image: "https://via.placeholder.com/300", isNew: true },
];

let orders = [];

// Public Routes - NO auth required
router.get('/products', (req, res) => {
  res.status(200).json({ success: true, data: products });
});

router.post('/orders', (req, res) => {
  const order = { id: orders.length + 1, ...req.body, createdAt: new Date() };
  orders.push(order);
  res.status(201).json({ success: true, message: "Order placed!", data: order });
});

module.exports = router;
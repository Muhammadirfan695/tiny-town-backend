const TinyTownService = require('../services/tinytown.service');
const asyncHandler = require('express-async-handler');

exports.getProducts = asyncHandler(async (req, res) => {
  const products = await TinyTownService.getAllProducts();
  res.status(200).json({ success: true, data: products });
});

exports.createProduct = asyncHandler(async (req, res) => {
  const product = await TinyTownService.addProduct(req.body);
  res.status(201).json({ success: true, message: "Product added!", data: product });
});

exports.createOrder = asyncHandler(async (req, res) => {
  const order = await TinyTownService.placeOrder(req.body);
  res.status(201).json({ success: true, message: "Order placed!", data: order });
});

exports.getOrders = asyncHandler(async (req, res) => {
  const orders = await TinyTownService.getOrders();
  res.status(200).json({ success: true, data: orders });
});
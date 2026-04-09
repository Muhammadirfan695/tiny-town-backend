const Product = require('../models/product.model');
const Order = require('../models/order.model');

class TinyTownService {
  async getAllProducts() {
    return await Product.findAll({ order: [['createdAt', 'DESC']] });
  }

  async addProduct(data) {
    return await Product.create(data);
  }

  async placeOrder(data) {
    return await Order.create(data);
  }

  async getOrders() {
    return await Order.findAll({ order: [['createdAt', 'DESC']] });
  }
}

module.exports = new TinyTownService();
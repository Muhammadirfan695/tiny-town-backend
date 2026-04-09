const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Product = sequelize.define('Product', {
  name: { type: DataTypes.STRING, allowNull: false },
  price: { type: DataTypes.STRING, allowNull: false },
  image: { type: DataTypes.TEXT },
  description: { type: DataTypes.TEXT },
  isNew: { type: DataTypes.BOOLEAN, defaultValue: true }
}, { 
  tableName: 'Products' // Migration mein table name 'Products' hai
});

module.exports = Product;
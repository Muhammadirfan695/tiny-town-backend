const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
      ssl: {
        require: process.env.DB_SSL === 'true' ? true : false,
        rejectUnauthorized: false 
      }
    },
    pool: {
      max: 3,
      min: 0,
      acquire: 5000,
      idle: 3000
    },
    connectTimeout: 5000,
    acquireTimeout: 5000
  }
);

const initializeDatabase = async () => {
  try {
    await sequelize.authenticate({ timeout: 5000 });
    console.log('✅ PostgreSQL connected successfully');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return false; 
  }
};

module.exports = { sequelize, initializeDatabase };
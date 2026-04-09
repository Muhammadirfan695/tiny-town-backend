const pg = require('pg');
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
    dialectModule: pg,
    logging: false,
    dialectOptions: {
      ssl: {
        require: process.env.DB_SSL === 'true',
        rejectUnauthorized: false 
      }
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 10000,
      idle: 5000
    },
    connectTimeout: 10000
  }
);

const initializeDatabase = async () => {
  try {
    await sequelize.authenticate({ timeout: 10000 });
    console.log('✅ PostgreSQL connected successfully');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return false; 
  }
};

module.exports = { sequelize, initializeDatabase };
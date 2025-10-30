const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");
const Dish = sequelize.define(
    "Dish",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      price: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      quantity: {
        type: DataTypes.STRING, // e.g. "2 persons", "800g"
        allowNull: true,
      },
      validity_start: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      validity_end: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      published: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      timestamps: true,
      freezeTableName: true,
    }
  );
  
  module.exports = Dish;
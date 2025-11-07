const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");
const FavouriteRestaurant = sequelize.define(
    "FavouriteRestaurant",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'User',
          key: 'id'
        },
        onDelete: "CASCADE",
      },
      restaurant_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Restaurant',
          key: 'id'
        },
        onDelete: "CASCADE",
      },
    },
    {
      timestamps: true,
      freezeTableName: true,
    }
  );
  
  module.exports = FavouriteRestaurant;
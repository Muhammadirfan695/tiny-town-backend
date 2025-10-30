const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const RestaurantMenu = sequelize.define(
  "RestaurantMenu",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    restaurant_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Restaurant",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    menu_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Menu",
        key: "id",
      },
      onDelete: "CASCADE",
    },
  },
  {
    timestamps: true,
    freezeTableName: true,
  }
);

module.exports = RestaurantMenu;

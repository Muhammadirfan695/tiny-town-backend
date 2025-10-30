const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const MenuDish = sequelize.define(
  "MenuDish",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
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
    dish_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Dish",
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

module.exports = MenuDish;

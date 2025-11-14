const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");
const Restaurant = require("./restaurant.model");
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
      type: DataTypes.STRING,
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
    restaurant_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'Restaurant',
        key: 'id'
      },
      onDelete: "CASCADE",
    },
    tags: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
    },
  },
  {
    timestamps: true,
    freezeTableName: true,
    scopes: {
      byOwner(ownerId) {
        return {
          include: [
            {
              model: Restaurant,
              as: "restaurant",
              required: true,
              where: { owner_id: ownerId },
            },
          ],
        };
      },
      byManager(managerId) {
        return {
          include: [
            {
              model: Restaurant,
              as: "restaurant",
              required: true,
              where: { manager_id: managerId },
            },
          ],
        };
      },
    },

  }
);

module.exports = Dish;
const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");
const Restaurant = require("./restaurant.model");


const Menu = sequelize.define(
  "Menu",
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
    timingStart: { type: DataTypes.TIME, allowNull: true },
    timingEnd: { type: DataTypes.TIME, allowNull: true },
    status: {
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
    qr_normal: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    qr_light: {
      type: DataTypes.STRING,
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
              where: { owner_id: ownerId }
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
              where: { manager_id: managerId }
            },
          ],
        };
      },
    },
  }
);

module.exports = Menu;

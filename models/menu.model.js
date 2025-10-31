const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");


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
    timingStart: { type: DataTypes.TIME, allowNull: false },
    timingEnd: { type: DataTypes.TIME, allowNull: false },
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

  },
  {
    timestamps: true,
    freezeTableName: true,
  }
);

module.exports = Menu;

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

module.exports = Menu;

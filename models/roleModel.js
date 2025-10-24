const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Role = sequelize.define(
  "Role",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.ENUM("Admin", "Manager", "Owner", "User"),
      allowNull: false,
      unique: true,
    },
  },
  { timestamps: true, freezeTableName: true, }
);

module.exports = Role;

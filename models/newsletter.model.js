const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Newsletter = sequelize.define(
  "Newsletter",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    type: {
      type: DataTypes.ENUM("manual", "weekly"),
      defaultValue: 'manual',
    },
    status: {
      type: DataTypes.ENUM('draft', 'ready', 'completed'),
      defaultValue: 'draft',
    },
    restaurant_id: {
      type: DataTypes.UUID,
      references: {
        model: 'Restaurant',
        key: 'id'
      },
      allowNull: true,
      onDelete: "CASCADE",
    },
  },
  {
    timestamps: true,
    freezeTableName: true,
  }
);

module.exports = Newsletter;

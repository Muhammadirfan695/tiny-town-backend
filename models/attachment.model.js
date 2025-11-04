const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Attachment = sequelize.define(
  "Attachment",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    model_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    model_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    attachment_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image_path: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { timestamps: true, freezeTableName: true }
);

module.exports = Attachment;

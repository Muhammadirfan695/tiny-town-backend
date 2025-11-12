const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const NewsletterRestaurants = sequelize.define(
  "NewsletterRestaurants",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    newsletter_id: {
      type: DataTypes.UUID,
      references: {
        model: 'Newsletter',
        key: 'id'
      },
      onDelete: "CASCADE",
    },
    restaurant_id: {
      type: DataTypes.UUID,
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

module.exports = NewsletterRestaurants;

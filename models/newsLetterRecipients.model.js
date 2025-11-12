const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const NewsletterRecipient = sequelize.define(
  "NewsletterRecipient",
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
    user_id: {
      type: DataTypes.UUID,
      references: {
        model: 'User',
        key: 'id'
      },
      allowNull: true,
      onDelete: "CASCADE",
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
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    sent_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('pending', 'sent', 'failed'),
      defaultValue: 'pending'
    },
  },
  {
    timestamps: true,
    freezeTableName: true,
  }
);

module.exports = NewsletterRecipient;

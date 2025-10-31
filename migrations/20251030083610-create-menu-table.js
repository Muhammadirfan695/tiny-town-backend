"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Menu", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      timingStart: {
        type: Sequelize.TIME,
        allowNull: false,
      },
      timingEnd: {
        type: Sequelize.TIME,
        allowNull: false,
      },
      status: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      restaurant_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: "Restaurant",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Menu");
  },
};

"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    // Add cuisine_type column as STRING
    await queryInterface.addColumn("Dish", "cuisine_type", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    // Remove the column on rollback
    await queryInterface.removeColumn("Dish", "cuisine_type");
  },
};

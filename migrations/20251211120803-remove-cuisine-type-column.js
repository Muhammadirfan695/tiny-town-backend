"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    // Drop the cuisine_type column
    await queryInterface.removeColumn("Dish", "cuisine_type");
  },

  async down(queryInterface, Sequelize) {
    // Optional: revert by adding column back (as STRING)
    await queryInterface.addColumn("Dish", "cuisine_type", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },
};

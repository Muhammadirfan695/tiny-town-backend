"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    // Drop existing column
    await queryInterface.removeColumn("Dish", "cuisine_type");

    // Add new column as STRING
    await queryInterface.addColumn("Dish", "cuisine_type", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    // Revert: drop the new STRING column
    await queryInterface.removeColumn("Dish", "cuisine_type");

    // Add back as ARRAY type
    await queryInterface.addColumn("Dish", "cuisine_type", {
      type: Sequelize.ARRAY(Sequelize.STRING),
      allowNull: true,
    });
  },
};

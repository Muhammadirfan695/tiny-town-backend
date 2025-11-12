"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Restaurant", "country", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn("Restaurant", "city", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn("Restaurant", "latitude", {
      type: Sequelize.DECIMAL(10, 8),
      allowNull: true,
    });

    await queryInterface.addColumn("Restaurant", "longitude", {
      type: Sequelize.DECIMAL(11, 8),
      allowNull: true,
    });

    await queryInterface.addColumn("Restaurant", "tags", {
      type: Sequelize.ARRAY(Sequelize.STRING),
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Restaurant", "country");
    await queryInterface.removeColumn("Restaurant", "city");
    await queryInterface.removeColumn("Restaurant", "latitude");
    await queryInterface.removeColumn("Restaurant", "longitude");
    await queryInterface.removeColumn("Restaurant", "tags");
  },
};

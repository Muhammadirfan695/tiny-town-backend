'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Menu', 'qr_normal', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('Menu', 'qr_light', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Menu', 'qr_normal');
    await queryInterface.removeColumn('Menu', 'qr_light');
  }
};

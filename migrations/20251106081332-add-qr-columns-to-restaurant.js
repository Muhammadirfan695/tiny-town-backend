'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Restaurant', 'qr_normal', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('Restaurant', 'qr_light', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Restaurant', 'qr_normal');
    await queryInterface.removeColumn('Restaurant', 'qr_light');
  },
};

'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('User', 'magicLoginToken', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('User', 'magicLoginTokenExpires', {
      type: Sequelize.DATE,
      allowNull: true,
    });

    await queryInterface.addColumn('User', 'verified_at', {
      type: Sequelize.DATE,
      allowNull: true, 
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('User', 'magicLoginToken');
    await queryInterface.removeColumn('User', 'magicLoginTokenExpires');
    await queryInterface.removeColumn('User', 'verified_at');
  },
};
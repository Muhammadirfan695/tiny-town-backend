'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

    await queryInterface.removeColumn('Restaurant', 'opening_hours');
    await queryInterface.removeColumn('Restaurant', 'closing_hours');

   
    await queryInterface.addColumn('Restaurant', 'hours', {
      type: Sequelize.JSON,
      allowNull: true,
      comment: 'Opening and closing hours for each day of the week'
    });
  },

  down: async (queryInterface, Sequelize) => {
   
    await queryInterface.removeColumn('Restaurant', 'hours');


    await queryInterface.addColumn('Restaurant', 'opening_hours', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('Restaurant', 'closing_hours', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  }
};

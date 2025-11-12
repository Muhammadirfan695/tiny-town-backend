'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Restaurant', 'postal_code', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('Restaurant', 'website', {
      type: Sequelize.STRING,
      allowNull: true,
      validate: { isUrl: true },
    });


    await queryInterface.addColumn('Restaurant', 'total_weekly_hours', {
      type: Sequelize.FLOAT,
      allowNull: true,
      comment: "Total number of hours the restaurant is open per week",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Restaurant', 'postal_code');
    await queryInterface.removeColumn('Restaurant', 'website');
    await queryInterface.removeColumn('Restaurant', 'total_weekly_hours');
  }
};

'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Newsletter', 'restaurant_id', {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: 'Restaurant',
        key: 'id'
      },
      onDelete: 'CASCADE'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Newsletter', 'restaurant_id');
  }
};

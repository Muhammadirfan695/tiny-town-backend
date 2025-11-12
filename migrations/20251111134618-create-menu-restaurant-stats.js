'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('MenuRestaurantStats', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      
      model_id: {
        type: Sequelize.UUID,
        allowNull: false
      },
      list: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      detail: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      type: {
        type: Sequelize.STRING,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Add unique composite index
    await queryInterface.addIndex('MenuRestaurantStats', ['model_id'], {
      unique: true,
      name: 'menu_restaurant_stats_user_unique'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('MenuRestaurantStats');
  }
};

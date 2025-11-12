'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('NewsletterRestaurants', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      newsletter_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'Newsletter', key: 'id' },
        onDelete: 'CASCADE',
      },
      restaurant_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'Restaurant', key: 'id' },
        onDelete: 'CASCADE',
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('NewsletterRestaurants');
  }
};

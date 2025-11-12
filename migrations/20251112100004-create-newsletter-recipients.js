'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('NewsletterRecipient', {
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
      user_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: { model: 'User', key: 'id' },
        onDelete: 'CASCADE',
      },
      restaurant_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: { model: 'Restaurant', key: 'id' },
        onDelete: 'CASCADE',
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      sent_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM('pending', 'sent', 'failed'),
        defaultValue: 'pending',
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
    await queryInterface.dropTable('NewsletterRecipient');
  }
};

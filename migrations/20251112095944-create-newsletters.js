'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Newsletter', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      content: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      type: {
        type: Sequelize.ENUM('manual', 'weekly'),
        defaultValue: 'manual'
      },
      status: {
        type: Sequelize.ENUM('draft', 'ready', 'completed'),
        defaultValue: 'draft'
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
    await queryInterface.dropTable('Newsletter');
  }
};

'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Drop the NewsletterRestaurants table
    await queryInterface.dropTable('NewsletterRestaurants');
  },

  async down(queryInterface, Sequelize) {
    // Recreate the NewsletterRestaurants table in case of rollback
    await queryInterface.createTable('NewsletterRestaurants', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      newsletter_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Newsletter',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      restaurant_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Restaurant',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    });
  }
};

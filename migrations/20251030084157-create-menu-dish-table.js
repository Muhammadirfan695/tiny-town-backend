'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('MenuDish', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      menu_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Menu',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      dish_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Dish',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('NOW()'),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('NOW()'),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('MenuDish');
  },
};

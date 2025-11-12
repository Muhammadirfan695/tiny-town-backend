module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Menu', 'timingStart', {
      type: Sequelize.TIME,
      allowNull: true,
    });
    await queryInterface.changeColumn('Menu', 'timingEnd', {
      type: Sequelize.TIME,
      allowNull: true,
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Menu', 'timingStart', {
      type: Sequelize.TIME,
      allowNull: false,
    });
    await queryInterface.changeColumn('Menu', 'timingEnd', {
      type: Sequelize.TIME,
      allowNull: false,
    });
  }
};

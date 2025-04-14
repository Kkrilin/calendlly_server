'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Bookings', 'start_time', {
      type: Sequelize.DATE, // Change to TIMESTAMP (DATE in Sequelize maps to TIMESTAMP in most DBs)
      allowNull: false,
    });

    await queryInterface.changeColumn('Bookings', 'end_time', {
      type: Sequelize.DATE, // Change to TIMESTAMP
      allowNull: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Bookings', 'start_time', {
      type: Sequelize.TIME, // Revert back to TIME
      allowNull: false,
    });

    await queryInterface.changeColumn('Bookings', 'end_time', {
      type: Sequelize.TIME, // Revert back to TIME
      allowNull: false,
    });
  },
};

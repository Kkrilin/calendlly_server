'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Rename the column in the EventTypes table
    await queryInterface.renameColumn('EventTypes', 'EventSlug', 'eventSlug');
  },

  down: async (queryInterface, Sequelize) => {
    // Revert the column name change
    await queryInterface.renameColumn('EventTypes', 'eventSlug', 'EventSlug');
  },
};

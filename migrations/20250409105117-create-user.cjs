'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('gen_random_uuid()'),
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      profileSlug: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
      },
      googleId: {
        type: Sequelize.STRING,
      },
      refreshToken: Sequelize.TEXT,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Users');
  },
};

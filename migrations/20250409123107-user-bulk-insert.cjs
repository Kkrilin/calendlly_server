'use strict';
const bycrypt = require('bcrypt');
module.exports = {
  async up(queryInterface, Sequelize) {
    // Insert bulk data into the Users table
    await queryInterface.bulkInsert('Users', [
      {
        id: Sequelize.literal('gen_random_uuid()'), // Generate UUID
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: await bycrypt.hash('123456', 10), // Replace with a hashed password
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: Sequelize.literal('gen_random_uuid()'),
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        password: await bycrypt.hash('123456', 10), // Replace with a hashed password
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: Sequelize.literal('gen_random_uuid()'),
        name: 'Alice Johnson',
        email: 'alice.johnson@example.com',
        password: await bycrypt.hash('123456', 10), // Replace with a hashed password
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    // Remove the inserted data
    await queryInterface.bulkDelete('Users', null, {});
  },
};

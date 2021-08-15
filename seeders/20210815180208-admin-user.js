'use strict';
require('dotenv').config();
const bcrypt = require("bcrypt");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const password = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);

    await queryInterface.bulkInsert("Users", [{
      character: process.env.ADMIN_CHARACTER,
      characterId: process.env.ADMIN_CHARACTER_ID,
      email: process.env.ADMIN_EMAIL,
      password: password,
      isAdmin: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }])
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Users", null, {});
  }
};

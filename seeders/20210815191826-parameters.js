'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert("Parameters", [{
      name: "recruiting",
      data: true
    }])
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Parameters", [{
      name: "recruiting"
    }]);
  }
};

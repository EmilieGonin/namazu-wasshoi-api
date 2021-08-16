'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert("Festivals", [{
      theme: "Plage paradisiaque",
      start_date: "2021-08-01 08:00",
      vote_date: "2021-08-27 20:00",
      end_date: "2021-08-29 20:00"
    }])
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Festivals", [{
      theme: "Plage paradisiaque"
    }]);
  }
};

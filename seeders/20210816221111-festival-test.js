'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert("Festivals", [{
      theme: "Soirée chic et cocktail",
      start_date: "2021-06-28 08:00",
      vote_date: "2021-07-30 20:00",
      end_date: "2021-08-02 07:59"
    }, {
      theme: "Plage paradisiaque",
      start_date: "2021-08-02 08:00",
      vote_date: "2021-08-27 20:00",
      end_date: "2021-08-29 20:00"
    }])
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Festivals", [{
      theme: ["Soirée chic et cocktail", "Plage paradisiaque"]
    }]);
  }
};

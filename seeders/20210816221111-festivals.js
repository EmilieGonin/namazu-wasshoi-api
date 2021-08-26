'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert("Festivals", [{
      edition: 1,
      theme: "La gourmandise"
    }, {
      edition: 2,
      theme: "Le pouvoir de l'amitié"
    }, {
      edition: 3,
      theme: "Canicule estivale"
    }, {
      edition: 4,
      theme: "Le ridicule ne tue pas"
    }, {
      edition: 5,
      theme: "Nuit de terreur"
    }, {
      edition: 6,
      theme: "Vacances à la montagne"
    }, {
      edition: 7,
      theme: "En quête de vengeance"
    }, {
      edition: 8,
      theme: "S'entraîner sans relâche"
    }, {
      edition: 9,
      theme: "Le langage des fleurs"
    }, {
      edition: 10,
      theme: "Identité secrète"
    }, {
      edition: 11,
      theme: "Incarner un boss de défi extrême"
    }, {
      edition: 12,
      theme: "Mélodie inspirante"
    }, {
      edition: 13,
      theme: "Soirée chic et cocktail",
      start_date: "2021-06-28 08:00",
      vote_date: "2021-07-30 20:00",
      end_date: "2021-08-02 07:59"
    }, {
      edition: 14,
      theme: "Plage paradisiaque",
      start_date: "2021-08-02 08:00",
      vote_date: "2021-08-27 20:00",
      end_date: "2021-08-29 20:00"
    }])
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Festivals", [{
      theme: ["La gourmandise", "Le pouvoir de l'amitié", "Canicule estivale", "Le ridicule ne tue pas", "Nuit de terreur", "Vacances à la montagne", "En quête de vengeance", "S'entraîner sans relâche", "Le langage des fleurs", "Identité secrète", "Incarner un boss de défi extrême", "Mélodie inspirante", "Soirée chic et cocktail", "Plage paradisiaque"]
    }]);
  }
};

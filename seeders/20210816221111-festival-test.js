'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert("Festivals", [{
      theme: "La gourmandise"
    }, {
      theme: "Le pouvoir de l'amitié"
    }, {
      theme: "Canicule estivale"
    }, {
      theme: "Le ridicule ne tue pas"
    }, {
      theme: "Nuit de terreur"
    }, {
      theme: "Vacances à la montagne"
    }, {
      theme: "En quête de vengeance"
    }, {
      theme: "S'entraîner sans relâche"
    }, {
      theme: "Le langage des fleurs"
    }, {
      theme: "Identité secrète"
    }, {
      theme: "Incarner un boss de défi extrême"
    }, {
      theme: "Mélodie inspirante"
    }, {
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
      theme: ["La gourmandise", "Le pouvoir de l'amitié", "Canicule estivale", "Le ridicule ne tue pas", "Nuit de terreur", "Vacances à la montagne", "En quête de vengeance", "S'entraîner sans relâche", "Le langage des fleurs", "Identité secrète", "Incarner un boss de défi extrême", "Mélodie inspirante", "Soirée chic et cocktail", "Plage paradisiaque"]
    }]);
  }
};

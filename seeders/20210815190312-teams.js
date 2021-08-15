'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert("Teams", [{
      name: "Mog",
      slogan: "Pas de coups sous le pompon !"
    },
    {
      name: "Chocobo",
      slogan: "On est chaud... cobo !"
    },
    {
      name: "Pampa",
      slogan: "Qui s'y frotte s'y pique !"
    },
    {
      name: "Carbuncle",
      slogan: "Que la poussière de diamant vous réduise en éclat !"
    }])
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Teams");
  }
};

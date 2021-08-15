'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("Users", "team", {
      type: Sequelize.STRING,
      references: {
        model: "Teams",
        key: "name",
        as: "team"
      }
    })

    await queryInterface.addColumn("Screenshots", "UserId", {
      type: Sequelize.INTEGER,
      allowNull: false,
      onDelete: "CASCADE",
      references: {
        model: "Users",
        key: "id",
      }
    })

    await queryInterface.addColumn("Screenshots", "FestivalId", {
      type: Sequelize.INTEGER,
      references: {
        model: "Festivals",
        key: "id",
      }
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("Users", "team");
  }
};

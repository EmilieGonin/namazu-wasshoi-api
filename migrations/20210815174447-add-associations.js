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
      onDelete: "CASCADE",
      references: {
        model: "Users",
        key: "id",
      }
    })

    await queryInterface.addColumn("Screenshots", "festival", {
      type: Sequelize.INTEGER,
      references: {
        model: "Festivals",
        key: "edition",
        as: "festival"
      }
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("Users", "team");
    await queryInterface.removeColumn("Screenshots", "UserId");
    await queryInterface.removeColumn("Screenshots", "festival");
  }
};

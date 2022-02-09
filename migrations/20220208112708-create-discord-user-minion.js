'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('DiscordUserMinions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      DiscordUserId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        // references: {
        //   model: "Users",
        //   key: "id",
        // }
      },
      MinionId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        // references: {
        //   model: "Minions",
        //   key: "id",
        // }
      },
      count: {
        type: Sequelize.INTEGER,
        defaultValue: 1
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('DiscordUserMinions');
  }
};

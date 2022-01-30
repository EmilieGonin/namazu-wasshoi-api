'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('DiscordUsers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      discordId: {
        allowNull: false,
        unique: true,
        type: Sequelize.STRING,
      },
      discordName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      tankJob: {
        type: Sequelize.STRING
      },
      healerJob: {
        type: Sequelize.STRING
      },
      melee_dpsJob: {
        type: Sequelize.STRING
      },
      physical_ranged_dpsJob: {
        type: Sequelize.STRING
      },
      magical_ranged_dpsJob: {
        type: Sequelize.STRING
      },
      notifications_24h: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      notifications_3h: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      notifications_1h: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
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
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('DiscordUsers');
  }
};

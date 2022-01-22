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
        type: Sequelize.BIGINT,
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
      notifications: {
        type: Sequelize.BOOLEAN
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

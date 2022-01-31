'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('DiscordEvents', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      discordId: {
        unique: true,
        allowNull: false,
        type: Sequelize.STRING
      },
      title: {
        allowNull: false,
        type: Sequelize.STRING
      },
      date: {
        allowNull: false,
        type: Sequelize.DATE
      },
      roles_tank: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      roles_healer: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      roles_melee_dps: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      roles_physical_ranged_dps: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      roles_magic_ranged_dps: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      state_dispo_si_besoin: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      state_maybe: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      state_pas_dispo: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      logs: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
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
    await queryInterface.dropTable('DiscordEvents');
  }
};

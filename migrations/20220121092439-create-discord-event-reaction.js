'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('DiscordEventReactions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      DiscordUserId: {
        type: Sequelize.INTEGER,
        references: {
          model: "DiscordUsers",
          key: 'id',
        }
      },
      DiscordEventId: {
        type: Sequelize.INTEGER,
        onDelete: 'CASCADE',
        references: {
          model: "DiscordEvents",
          key: 'id'
        }
      },
      role: {
        type: Sequelize.STRING
      },
      state: {
        type: Sequelize.STRING
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
    await queryInterface.dropTable('DiscordEventReactions');
  }
};

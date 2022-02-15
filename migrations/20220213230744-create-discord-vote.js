'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('DiscordVotes', {
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
      vote: {
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
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('DiscordVotes');
  }
};

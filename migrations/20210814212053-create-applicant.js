'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Applicants', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      birthday: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      discord: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      mic: {
        type: Sequelize.BOOLEAN,
        allowNull: false
      },
      availability: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      about: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      character: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      characterId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true
      },
      msq: {
        type: Sequelize.BOOLEAN,
        allowNull: false
      },
      mainClass: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      playtime: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      gameActivities: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      cl: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      clRequired: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      currentCl: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      exp: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      savageRequired: {
        type: Sequelize.TEXT,
        allowNull: false
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
    await queryInterface.dropTable('Applicants');
  }
};

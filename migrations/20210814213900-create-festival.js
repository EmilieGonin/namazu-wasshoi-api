'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Festivals', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      edition: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true
      },
      theme: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      start: {
        type: Sequelize.DATE,
        unique: true
      },
      vote: {
        type: Sequelize.DATE,
        unique: true
      },
      end: {
        type: Sequelize.DATE,
        unique: true
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Festivals');
  }
};

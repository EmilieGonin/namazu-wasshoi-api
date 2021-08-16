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
      theme: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      submit_date: {
        type: Sequelize.DATE,
        allowNull: false,
        unique: true
      },
      vote_date: {
        type: Sequelize.DATE,
        allowNull: false,
        unique: true
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Festivals');
  }
};

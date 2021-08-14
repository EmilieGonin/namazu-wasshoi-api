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
        type: DataTypes.DATEONLY,
        allowNull: false
      },
      discord: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      mic: {
        type: DataTypes.BOOLEAN,
        allowNull: false
      },
      availability: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      about: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      character: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      characterId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true
      },
      mainClass: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      playtime: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      gameActivities: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      cl: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      clRequired: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      currentCl: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      exp: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      savageRequired: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      team: {
        type: DataTypes.STRING,
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

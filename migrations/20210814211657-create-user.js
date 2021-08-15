'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      password: {
        type: Sequelize.STRING,
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
      discord: {
        type: Sequelize.STRING,
        unique: true
      },
      birthday: {
        type: Sequelize.DATEONLY
      },
      avatar: {
        type: Sequelize.STRING
      },
      isAdmin: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      isGolden: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      isLunar: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      isFail: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      team: {
        type: Sequelize.STRING,
        references: {
          model: "Teams",
          key: "name",
          as: "team"
        }
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
    await queryInterface.dropTable('Users');
  }
};

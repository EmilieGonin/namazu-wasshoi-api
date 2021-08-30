'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Profiles', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      avatar: {
        type: Sequelize.STRING
      },
      name: {
        type: Sequelize.STRING
      },
      discord: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      birthday: {
        type: Sequelize.DATEONLY
      },
      mic: {
        type: Sequelize.BOOLEAN
      },
      bio: {
        type: Sequelize.TEXT
      },
      UserId: {
        type: Sequelize.INTEGER,
        onDelete: "CASCADE",
        references: {
          model: "Users",
          key: "id",
        }
      },
      ApplicantId: {
        type: Sequelize.INTEGER,
        onDelete: "CASCADE",
        references: {
          model: "Applicants",
          key: "id",
        }
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Profiles');
  }
};

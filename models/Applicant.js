'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Applicant extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Applicant.init({
    name: DataTypes.STRING,
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
    }
  }, {
    sequelize,
    modelName: 'Applicant',
  });
  return Applicant;
};

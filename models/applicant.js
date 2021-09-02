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
      Applicant.belongsTo(models.Team, { targetKey: "name", foreignKey: "team" })
      Applicant.hasOne(models.Profile)
      Applicant.hasOne(models.Character)
    }
  };
  Applicant.init({
    msq: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    availability: {
      type: DataTypes.TEXT,
      allowNull: false,
      get() {
        return { label: "Disponibilités", value: this.getDataValue("availability") }
      }
    },
    about: {
      type: DataTypes.TEXT,
      allowNull: false,
      get() {
        return { label: "À propos", value: this.getDataValue("about") }
      }
    },
    mainClass: {
      type: DataTypes.TEXT,
      allowNull: false,
      get() {
        return { label: "Classe principale", value: this.getDataValue("mainClass") }
      }
    },
    playtime: {
      type: DataTypes.TEXT,
      allowNull: false,
      get() {
        return { label: "Temps de jeu", value: this.getDataValue("playtime") }
      }
    },
    gameActivities: {
      type: DataTypes.TEXT,
      allowNull: false,
      get() {
        return { label: "Activités préférées", value: this.getDataValue("gameActivities") }
      }
    },
    cl: {
      type: DataTypes.TEXT,
      allowNull: false,
      get() {
        return { label: "Choix de CL", value: this.getDataValue("cl") }
      }
    },
    clRequired: {
      type: DataTypes.TEXT,
      allowNull: false,
      get() {
        return { label: "Critères obligatoires", value: this.getDataValue("clRequired") }
      }
    },
    currentCl: {
      type: DataTypes.TEXT,
      allowNull: false,
      get() {
        return { label: "CL actuelle", value: this.getDataValue("currentCl") }
      }
    },
    exp: {
      type: DataTypes.TEXT,
      allowNull: false,
      get() {
        return { label: "Expérience HL", value: this.getDataValue("exp") }
      }
    },
    savageRequired: {
      type: DataTypes.TEXT,
      allowNull: false,
      get() {
        return { label: "Roster sadique", value: this.getDataValue("savageRequired") }
      }
    }
  }, {
    sequelize,
    modelName: 'Applicant',
  });
  return Applicant;
};

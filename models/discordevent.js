'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DiscordEvent extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      DiscordEvent.hasMany(models.DiscordEventReaction);
    }
  };
  DiscordEvent.init({
    discordId: {
      type: DataTypes.BIGINT,
      unique: true,
      allowNull: false
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    roles_tank: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    roles_healer: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    roles_melee_dps: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    roles_physical_ranged_dps: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    roles_magic_ranged_dps: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    state_dispo_si_besoin: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    state_maybe: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    state_pas_dispo: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  }, {
    sequelize,
    modelName: 'DiscordEvent',
  });
  return DiscordEvent;
};
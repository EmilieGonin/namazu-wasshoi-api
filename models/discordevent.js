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
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    title: {
      allowNull: false,
      type: DataTypes.STRING
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    formattedDate: {
      type: DataTypes.STRING,
      allowNull: false
    },
    hour: {
      type: DataTypes.STRING,
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
    },
    logs: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    notifications_24h: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    notifications_3h: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    notifications_1h: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    sequelize,
    modelName: 'DiscordEvent',
  });
  return DiscordEvent;
};

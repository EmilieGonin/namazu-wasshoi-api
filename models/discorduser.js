'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DiscordUser extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      DiscordUser.hasMany(models.DiscordEventReaction);
    }
  };
  DiscordUser.init({
    discordId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      unique: true
    },
    discordName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    tankJob: DataTypes.STRING,
    healerJob: DataTypes.STRING,
    melee_dpsJob: DataTypes.STRING,
    physical_ranged_dpsJob: DataTypes.STRING,
    notifications: {
      type: DataTypes.BOOLEAN
    }
  }, {
    sequelize,
    modelName: 'DiscordUser',
  });
  return DiscordUser;
};

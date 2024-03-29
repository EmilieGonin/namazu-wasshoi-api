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
      DiscordUser.hasMany(models.DiscordVote);
      DiscordUser.belongsToMany(models.Minion, { through: 'DiscordUserMinions' });
    }
  };
  DiscordUser.init({
    discordId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    discordName: {
      type: DataTypes.BLOB,
      allowNull: false,
      get() {
        return this.getDataValue('discordName').toString();
      },
      set(value) {
        return this.setDataValue('discordName', Buffer.from(value));
      }
    },
    tankJob: DataTypes.STRING,
    healerJob: DataTypes.STRING,
    melee_dpsJob: DataTypes.STRING,
    physical_ranged_dpsJob: DataTypes.STRING,
    magic_ranged_dpsJob: DataTypes.STRING,
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
    },
    timerMinion: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'DiscordUser',
  });
  return DiscordUser;
};

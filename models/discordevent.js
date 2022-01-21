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
      DiscordEvent.belongsToMany(models.DiscordUser, { through: models.DiscordUserEvents });
    }
  };
  DiscordEvent.init({
    discordId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'DiscordEvent',
  });
  return DiscordEvent;
};

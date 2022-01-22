'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DiscordEventReaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      DiscordEventReaction.belongsTo(models.DiscordUser);
      DiscordEventReaction.belongsTo(models.DiscordEvent);
    }
  };
  DiscordEventReaction.init({
    role: DataTypes.STRING,
    state: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'DiscordEventReaction',
  });
  return DiscordEventReaction;
};

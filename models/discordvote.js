'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DiscordVote extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      DiscordVote.belongsTo(models.DiscordUser);
      DiscordVote.belongsTo(models.DiscordEvent);
    }
  }
  DiscordVote.init({
    vote: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'DiscordVote',
  });
  return DiscordVote;
};

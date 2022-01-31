'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DiscordMessage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  DiscordMessage.init({
    discordId: DataTypes.STRING,
    type: DataTypes.STRING,
    content: DataTypes.BLOB
  }, {
    sequelize,
    modelName: 'DiscordMessage',
  });
  return DiscordMessage;
};
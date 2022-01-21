'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DiscordUserEvents extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  DiscordUserEvents.init({
    DiscordUserId: {
      type: DataTypes.INTEGER,
      references: {
        model: "DiscordUsers",
        key: 'id'
      }
    },
    DiscordEventId: {
      type: DataTypes.INTEGER,
      references: {
        model: "DiscordEvents",
        key: 'id'
      }
    },
    role: DataTypes.STRING,
    state: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'DiscordUserEvents',
  });
  return DiscordUserEvents;
};

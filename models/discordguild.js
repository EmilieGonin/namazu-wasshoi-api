'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DiscordGuild extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  DiscordGuild.init({
    discordId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    playing: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    queue: {
      type: DataTypes.BLOB,
      get() {
        return JSON.parse(this.getDataValue('queue'));
      },
      set(value) {
        if (value == null) {
          return this.setDataValue('queue', null)
        } else {
          return this.setDataValue('queue', Buffer.from(JSON.stringify(value)));
        }
      }
    }
  }, {
    sequelize,
    modelName: 'DiscordGuild',
  });
  return DiscordGuild;
};

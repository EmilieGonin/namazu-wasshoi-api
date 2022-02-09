'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Minion extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Minion.belongsToMany(models.DiscordUser, { through: 'DiscordUserMinions' });
    }
  }
  Minion.init({
    icon: DataTypes.STRING,
    name: DataTypes.STRING,
    rarity: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Minion',
  });
  return Minion;
};

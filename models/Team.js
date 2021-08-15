'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Team extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Team.hasMany(models.User, { sourceKey: "name", foreignKey: "team" })
    }
  };
  Team.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    slogan: {
      type: DataTypes.STRING,
      unique: true
    }
  }, {
    sequelize,
    modelName: 'Team',
  });
  return Team;
};

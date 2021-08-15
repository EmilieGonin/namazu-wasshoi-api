'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Roster extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Roster.hasMany(models.User, { sourceKey: "name", foreignKey: "roster" })
    }
  };
  Roster.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    startHour: {
      type: DataTypes.TIME,
      allowNull: false
    },
    endHour: {
      type: DataTypes.TIME,
      allowNull: false
    },
    isRecruiting: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    sequelize,
    modelName: 'Roster',
  });
  return Roster;
};

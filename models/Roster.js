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
      // define association here
    }
  };
  Roster.init({
    name: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    },
    startHour: {
      type: Sequelize.TIME,
      allowNull: false
    },
    endHour: {
      type: Sequelize.TIME,
      allowNull: false
    },
    isRecruiting: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    }
  }, {
    sequelize,
    modelName: 'Roster',
  });
  return Roster;
};

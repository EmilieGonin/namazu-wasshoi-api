'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Festival extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Festival.init({
    theme: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    },
    submit_date: {
      type: Sequelize.DATE,
      allowNull: false,
      unique: true
    },
    vote_date: {
      type: Sequelize.DATE,
      allowNull: false,
      unique: true
    }
  }, {
    sequelize,
    modelName: 'Festival',
  });
  return Festival;
};

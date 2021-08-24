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
      Festival.hasMany(models.Screenshot);
      Festival.hasMany(models.Screenshot.scope("winner"), { as: "winners" });
    }
  };
  Festival.init({
    edition: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true
    },
    theme: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    start_date: {
      type: DataTypes.DATE,
      unique: true
    },
    vote_date: {
      type: DataTypes.DATE,
      unique: true
    },
    end_date: {
      type: DataTypes.DATE,
      unique: true
    },
  }, {
    sequelize,
    modelName: 'Festival',
    timestamps: false
  });
  return Festival;
};

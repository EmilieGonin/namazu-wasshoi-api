'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Profile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Profile.belongsTo(models.User)
      Profile.belongsTo(models.Applicant)
    }
  };
  Profile.init({
    avatar: DataTypes.STRING,
    name: DataTypes.STRING,
    discord: {
      type: DataTypes.STRING,
      unique: true
    },
    birthday: DataTypes.DATEONLY,
    mic: DataTypes.BOOLEAN,
    bio: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Profile',
    timestamps: false
  });
  Profile.removeAttribute("id");
  return Profile;
};

'use strict';
const bcrypt = require("bcrypt");

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.belongsTo(models.Team, { targetKey: "name", foreignKey: "team" }),
      User.hasMany(models.Screenshot, {
        onDelete: "CASCADE",
        foreignKey: {
          allowNull: false
        }
      })
    }
    passwordIsValid(password) {
      return bcrypt.compareSync(password, this.password);
    }
  };
  User.init({
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    character: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    characterId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true
    },
    discord: {
      type: DataTypes.STRING,
      unique: true
    },
    birthday: DataTypes.DATEONLY,
    avatar: DataTypes.STRING,
    isAdmin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    isGolden: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    isLunar: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    isFail: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    sequelize,
    modelName: 'User',
  });
  User.beforeCreate(async (user) => {
    user.password = await bcrypt.hash(user.password, 10);
  })
  return User;
};

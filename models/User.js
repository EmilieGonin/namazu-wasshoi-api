const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  return sequelize.define("User", {
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
      type: DataTypes.STRING
    },
    birthday: {
      type: DataTypes.DATEONLY
    },
    avatar: {
      type: DataTypes.STRING
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  })
}

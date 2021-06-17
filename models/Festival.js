const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  return sequelize.define("Festival", {
    theme: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    submit_date: {
      type: DataTypes.DATE,
      allowNull: false,
      unique: true
    },
    vote_date: {
      type: DataTypes.DATE,
      allowNull: false,
      unique: true
    }
  })
}

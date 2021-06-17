const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  return sequelize.define("Screenshot", {
    description: {
      type: DataTypes.STRING,
      allowNull: false
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false
    }
  })
}

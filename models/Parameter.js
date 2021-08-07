const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  return sequelize.define("Parameter", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    data: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    }
  }, {
    timestamps: false
  })
}

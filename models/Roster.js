const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  return sequelize.define("Roster", {
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
  })
}

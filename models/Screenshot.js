'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Screenshot extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Screenshot.belongsTo(models.User),
      Screenshot.belongsTo(models.Festival, { targetKey: "edition", foreignKey: "festival" })
    }
  };
  Screenshot.init({
    public_id: DataTypes.STRING,
    url: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: DataTypes.STRING,
    isWinner: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    sequelize,
    modelName: 'Screenshot',
  });
  Screenshot.addScope("winner", {
    where: { isWinner: true }
  });
  return Screenshot;
};

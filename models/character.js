'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Character extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
     getCharacter() {
       const { xivapi } = require("../helpers/xivapi");

       xivapi.character.get(this.lodestoneId)
       .then((res) => {
         const character = {
           name: res.Character.Name,
           avatar: res.Character.Avatar
         };
         const gender = res.Character.Gender;

         xivapi.data.get("title", res.Character.Title)
         .then((title) => {
           if (title && gender == 1) {
             title = title.Name;
           } else if (title && gender == 2) {
             title = title.NameFemale;
           } else {
             title = null;
           }

           character.title = title;
           this.update(character);
         })
       })
     }
    static associate(models) {
      Character.belongsTo(models.User)
      Character.belongsTo(models.Applicant)
    }
  };
  Character.init({
    name: {
      type: DataTypes.STRING,
      unique: true
    },
    lodestoneId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true
    },
    title: DataTypes.STRING,
    avatar: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Character'
  });
  Character.afterCreate(async (character) => {
    await character.getCharacter();
  })

  return Character;
};

'use strict';
const add = require('date-fns/add');
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
     hasExpired() {
       const now = new Date();
       return now > this.expire;
     }
     async getCharacter() {
       const { xivapi } = require("../helpers/xivapi");

       const res = await xivapi.character.get(this.lodestoneId);
       const character = {
         name: res.Character.Name,
         avatar: res.Character.Avatar
       };

       const gender = res.Character.Gender;
       const hasTitle = res.Character.TitleTop;
       let title;

       if (hasTitle) {
         title = await xivapi.data.get("title", res.Character.Title);

         if (gender == 1) {
           title = title.Name;
         } else if (gender == 2) {
           title = title.NameFemale;
         }
       } else {
         title = null;
       }

       character.title = title;
       await this.update(character);
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
    avatar: DataTypes.STRING,
    expire: {
      type: DataTypes.VIRTUAL,
      get() {
        return add(this.updatedAt, { hours: 3 });
      }
    }
  }, {
    sequelize,
    modelName: 'Character'
  });
  Character.afterCreate(async (character) => {
    await character.getCharacter();
  })

  return Character;
};

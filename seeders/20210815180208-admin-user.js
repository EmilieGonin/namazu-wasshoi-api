'use strict';
require('dotenv').config();
const bcrypt = require("bcrypt");
const models = require('../models');
const User = models.User;

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const password = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);

    await queryInterface.bulkInsert("Users", [{
      email: process.env.ADMIN_EMAIL,
      password: password,
      isAdmin: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }])

    const user = await User.findOne({
      where: { email: process.env.ADMIN_EMAIL }
    });

    const { xivapi } = require("../helpers/xivapi");

    const res = await xivapi.character.get(process.env.ADMIN_CHARACTER_ID);

    const data = {
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

    data.title = title;

    await queryInterface.bulkInsert("Characters", [{
      lodestoneId: process.env.ADMIN_CHARACTER_ID,
      name: data.name,
      title: data.title,
      avatar: data.avatar,
      UserId: user.id,
      createdAt: new Date(),
      updatedAt: new Date()
    }])
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Users", [{
      email: process.env.ADMIN_EMAIL
    }]);

    await queryInterface.bulkDelete("Characters", [{
      lodestoneId: process.env.ADMIN_CHARACTER_ID
    }]);
  }
};

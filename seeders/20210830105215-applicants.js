'use strict';
const models = require('../models');
const Applicant = models.Applicant;
const now = new Date();

module.exports = {
  up: async (queryInterface, Sequelize) => {

    await queryInterface.bulkInsert("Applicants", [{
      team: "Mog",
      availability: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce lacinia, nibh nec mattis iaculis, lacus ex dictum tellus, eu euismod ligula enim quis urna. Donec porta vehicula orci vel scelerisque. Nam hendrerit venenatis ligula at placerat. Donec maximus magna pulvinar tincidunt dignissim. Proin ac suscipit urna, ut dignissim nisi. Aenean dictum finibus ante sed dapibus. Nulla suscipit sapien ultricies lectus luctus, ut sodales nisi commodo.",
      about: "Test",
      msq: "Test",
      mainClass: "Test",
      playtime: "Test",
      gameActivities: "Test",
      cl: "Test",
      clRequired: "Test",
      currentCl: "Test",
      exp: "Test",
      savageRequired: "Test",
      createdAt: now,
      updatedAt: new Date()
    }])

    const applicant = await Applicant.findOne({
      where: { about: "Test" }
    });

    await queryInterface.bulkInsert("Profiles", [{
      name: "Test",
      birthday: "1111-11-11",
      discord: "Test#0000",
      mic: true,
      ApplicantId: applicant.id
    }])

    const { xivapi } = require("../helpers/xivapi");

    const res = await xivapi.character.get(1);

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
      lodestoneId: 1,
      name: data.name,
      title: data.title,
      avatar: data.avatar,
      ApplicantId: applicant.id,
      createdAt: new Date(),
      updatedAt: new Date()
    }])
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Applicants", [{
      about: "Test"
    }]);

    await queryInterface.bulkDelete("Profiles", [{
      name: "Test"
    }]);

    await queryInterface.bulkDelete("Characters", [{
      lodestoneId: 1
    }]);
  }
};

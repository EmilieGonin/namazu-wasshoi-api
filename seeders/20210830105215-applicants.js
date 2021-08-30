'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert("Applicants", [{
      name: "Test",
      birthday: "1111-11-11",
      discord: "Test#0000",
      mic: true,
      character: "Test Test",
      characterId: 1,
      team: "Mog",
      msq: true,
      availability: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce lacinia, nibh nec mattis iaculis, lacus ex dictum tellus, eu euismod ligula enim quis urna. Donec porta vehicula orci vel scelerisque. Nam hendrerit venenatis ligula at placerat. Donec maximus magna pulvinar tincidunt dignissim. Proin ac suscipit urna, ut dignissim nisi. Aenean dictum finibus ante sed dapibus. Nulla suscipit sapien ultricies lectus luctus, ut sodales nisi commodo.",
      about: "Test",
      mainClass: "Test",
      playtime: "Test",
      gameActivities: "Test",
      cl: "Test",
      clRequired: "Test",
      currentCl: "Test",
      exp: "Test",
      savageRequired: "Test",
      createdAt: new Date(),
      updatedAt: new Date()
    }])
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Applicants", [{
      name: "Test"
    }]);
  }
};

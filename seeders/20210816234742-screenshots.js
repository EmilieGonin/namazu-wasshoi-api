'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert("Screenshots", [{
      description: "Test - 1",
      url: "https://res.cloudinary.com/hh2lzr1uk/image/upload/v1629158322/sample_q9p7g1.png",
      isWinner: true,
      UserId: 1,
      FestivalId: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      description: "Test - 2",
      url: "https://res.cloudinary.com/hh2lzr1uk/image/upload/v1629158322/sample_q9p7g1.png",
      isWinner: true,
      UserId: 1,
      FestivalId: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      description: "Test - 3",
      url: "https://res.cloudinary.com/hh2lzr1uk/image/upload/v1629158322/sample_q9p7g1.png",
      UserId: 1,
      FestivalId: 2,
      createdAt: new Date(),
      updatedAt: new Date()
    }])
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Screenshots", [{
      url: ["https://res.cloudinary.com/hh2lzr1uk/image/upload/v1629158322/sample_q9p7g1.png"]
    }]);
  }
};

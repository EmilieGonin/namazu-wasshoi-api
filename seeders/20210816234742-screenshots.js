'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert("Screenshots", [{
      description: "Test - 1",
      url: "https://res.cloudinary.com/hh2lzr1uk/image/upload/v1629158322/sample_q9p7g1.png",
      isWinner: true,
      FestivalId: 13,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      description: "Test - 2",
      url: "https://res.cloudinary.com/hh2lzr1uk/image/upload/v1629291960/sample_2_hjyqow.png",
      isWinner: true,
      FestivalId: 13,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      description: "Test - 3",
      url: "https://res.cloudinary.com/hh2lzr1uk/image/upload/v1629158322/sample_q9p7g1.png",
      UserId: 1,
      FestivalId: 14,
      createdAt: new Date(),
      updatedAt: new Date()
    }])
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Screenshots", [{
      url: ["https://res.cloudinary.com/hh2lzr1uk/image/upload/v1629158322/sample_q9p7g1.png", "https://res.cloudinary.com/hh2lzr1uk/image/upload/v1629291960/sample_2_hjyqow.png"]
    }]);
  }
};

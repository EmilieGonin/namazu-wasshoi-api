'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert("Screenshots", [{
      url: "https://res.cloudinary.com/hh2lzr1uk/image/upload/v1631542495/festivals/14/Nexara_compressed_zlvf2k.png",
      isWinner: true,
      festival: 14,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      description: "Sur une scène de sable fin, une danseuse solitaire répète, au rythme des vagues.",
      url: "https://res.cloudinary.com/hh2lzr1uk/image/upload/v1631543007/festivals/14/Jalee_compressed_z0zwxl.png",
      isWinner: true,
      festival: 14,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      description: "Test",
      url: "https://res.cloudinary.com/hh2lzr1uk/image/upload/v1629158322/sample_q9p7g1.png",
      festival: 14,
      createdAt: new Date(),
      updatedAt: new Date()
    }])
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Screenshots", [{
      url: ["https://res.cloudinary.com/hh2lzr1uk/image/upload/v1629158322/sample_q9p7g1.png", "https://res.cloudinary.com/hh2lzr1uk/image/upload/v1631542495/festivals/14/Nexara_compressed_zlvf2k.png", "https://res.cloudinary.com/hh2lzr1uk/image/upload/v1631543007/festivals/14/Jalee_compressed_z0zwxl.png"]
    }]);
  }
};

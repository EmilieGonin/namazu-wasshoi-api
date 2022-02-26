'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.renameColumn("DiscordUsers", "magical_ranged_dpsJob", "magic_ranged_dpsJob")
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.renameColumn("DiscordUsers", "magic_ranged_dpsJob", "magical_ranged_dpsJob")
  }
};

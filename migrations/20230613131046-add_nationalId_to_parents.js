'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn('parents', 'lang', {
      type: Sequelize.TEXT,
    });
    await queryInterface.addColumn('parents', 'nationalId', {
      type: Sequelize.TEXT,
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn('parents', 'lang');
    await queryInterface.removeColumn('parents', 'nationalId');
  }
};

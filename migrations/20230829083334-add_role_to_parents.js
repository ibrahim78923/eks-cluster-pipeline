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
    await queryInterface.addColumn('plans', 'noOfStudent', {
      type: Sequelize.TEXT
    });
    await queryInterface.addColumn('plans', 'noOfSchool', {
      type: Sequelize.TEXT
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn('plans', 'noOfStudent');
    await queryInterface.removeColumn('plans', 'noOfSchool');
  }
};

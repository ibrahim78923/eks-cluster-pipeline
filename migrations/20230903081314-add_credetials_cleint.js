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
    await queryInterface.addColumn('clients', 'forgetAt', {
      type: Sequelize.TEXT
    });
    await queryInterface.addColumn('clients', 'forget', {
      type: Sequelize.BOOLEAN,defaultValue: true,
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn('clients', 'forgetAt');
    await queryInterface.removeColumn('clients', 'forget');
  }
};

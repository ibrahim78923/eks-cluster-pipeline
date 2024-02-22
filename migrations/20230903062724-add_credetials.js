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
    await queryInterface.addColumn('parents', 'forgetAt', {
      type: Sequelize.TEXT
    });
    await queryInterface.addColumn('parents', 'forget', {
      type: Sequelize.BOOLEAN,defaultValue: true,
    });
    await queryInterface.addColumn('teachers', 'forgetAt', {
      type: Sequelize.TEXT
    });
    await queryInterface.addColumn('teachers', 'forget', {
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
    await queryInterface.removeColumn('parents', 'forgetAt');
    await queryInterface.removeColumn('parents', 'forget');
    await queryInterface.removeColumn('teachers', 'forgetAt');
    await queryInterface.removeColumn('teachers', 'forget');
  }
};

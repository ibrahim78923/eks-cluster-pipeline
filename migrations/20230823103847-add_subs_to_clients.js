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
    await queryInterface.addColumn('clients', 'cancelSubscription', {
      type: Sequelize.BOOLEAN, defaultValue: true
    });
    await queryInterface.addColumn('clients', 'deactivate', {
      type: Sequelize.BOOLEAN, defaultValue: true
    });
    await queryInterface.addColumn('clients', 'cancelSubscriptionDate', {
      type: Sequelize.TEXT
    });
    await queryInterface.addColumn('clients', 'cancelSubscriptionReason', {
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
    await queryInterface.removeColumn('clients', 'cancelSubscription');
    await queryInterface.removeColumn('clients', 'deactivate');
    await queryInterface.removeColumn('clients', 'cancelSubscriptionDate');
    await queryInterface.removeColumn('clients', 'cancelSubscriptionReason');
    }
};

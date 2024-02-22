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
    await queryInterface.addColumn('clients', 'address', {
      type: Sequelize.TEXT,
    });
    await queryInterface.addColumn('clients', 'zipCode', {
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
    down: async (queryInterface, Sequelize) => {
      await queryInterface.removeColumn('clients', 'address');
      await queryInterface.removeColumn('clients', 'zipCode');
    }
  }
};

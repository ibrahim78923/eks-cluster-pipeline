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
    await queryInterface.addColumn("clients", "schoolName", {
      type: Sequelize.TEXT,
    });
    await queryInterface.addColumn("clients", "mobile", {
      type: Sequelize.TEXT,
    });
    await queryInterface.addColumn("clients", "landline", {
      type: Sequelize.TEXT,
    });
    await queryInterface.addColumn("clients", "perUserPrice", {
      type: Sequelize.TEXT,
    });
    await queryInterface.addColumn("clients", "startDate", {
      type: Sequelize.TEXT,
    });
    await queryInterface.addColumn("clients", "duration", {
      type: Sequelize.TEXT,
    });
    await queryInterface.addColumn("clients", "expiryDate", {
      type: Sequelize.TEXT,
    });
    await queryInterface.addColumn("clients", "country", {
      type: Sequelize.TEXT,
    });
    await queryInterface.addColumn("clients", "city", {
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
    await queryInterface.removeColumn("clients", "schoolName");
    await queryInterface.removeColumn("clients", "mobile");
    await queryInterface.removeColumn("clients", "landline");
    await queryInterface.removeColumn("clients", "perUserPrice");
    await queryInterface.removeColumn("clients", "startDate");
    await queryInterface.removeColumn("clients", "duration");
    await queryInterface.removeColumn("clients", "expiryDate");
    await queryInterface.removeColumn("clients", "country");
    await queryInterface.removeColumn("clients", "city");
  }
};

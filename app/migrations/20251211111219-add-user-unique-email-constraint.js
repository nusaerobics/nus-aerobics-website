"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addConstraint('users', {
      fields: ['email'],
      type: 'unique',
      name: 'unique_users_email'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('users', 'unique_users_email');
  }
};

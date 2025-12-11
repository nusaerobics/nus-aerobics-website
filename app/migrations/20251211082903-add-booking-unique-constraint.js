"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addConstraint("bookings", {
      fields: ["classId", "userId"],
      type: "unique",
      name: "unique_class_user_booking"
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint("bookings", "unique_class_user_booking");
  }
};

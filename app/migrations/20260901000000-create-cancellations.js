"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("cancellations", {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true, allowNull: false },
      bookingId: { type: Sequelize.INTEGER, allowNull: false },
      userId: { type: Sequelize.INTEGER, allowNull: false },
      classId: { type: Sequelize.INTEGER, allowNull: false },
      cancelledAt: { type: Sequelize.DATE, allowNull: false },
      eligibleForRefund: { type: Sequelize.BOOLEAN, allowNull: false },
      isForced: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });
    await queryInterface.addIndex("cancellations", ["cancelledAt"]);
    await queryInterface.addIndex("cancellations", ["userId"]);
    await queryInterface.addIndex("cancellations", ["eligibleForRefund"]);
  },

  async down(queryInterface) {
    await queryInterface.dropTable("cancellations");
  },
};

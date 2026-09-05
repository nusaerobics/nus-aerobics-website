module.exports = (sequelize, DataTypes) => {
  const Cancellation = sequelize.define("cancellation", {
    bookingId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    classId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    cancelledAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    eligibleForRefund: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    isForced: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  });
  return Cancellation;
};

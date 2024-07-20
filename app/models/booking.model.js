module.exports = (sequelize, DataTypes) => {
  const Booking = sequelize.define("booking", {
    attendance: {
      type: DataTypes.ENUM("present", "absent"),
      defaultValue: "absent",
      allowNull: false,
    },
  });
  return Booking;
}

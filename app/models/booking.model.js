module.exports = (sequelize, DataTypes) => {
  const Booking = sequelize.define("booking", {
    attendance: {
      type: DataTypes.ENUM("present", "absent"),
      defaultValue: "absent",
      allowNull: false,
    },
  }, {
    indexes: [
      {
        unique: true,
        fields: ["classId", "userId"],
        name: "unique_class_user_booking"
      }
    ]
  });
  return Booking;
}


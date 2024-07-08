import { DataTypes } from "sequelize";
import sequelize from "../utils/sequelize";

const Booking = sequelize.define("booking", {
  bookingDate: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  // TODO: Add in user who made booking and what class it was for by ID
});

// NOTE: How will it know what models is?
// Booking.associate = (models) => {
//   Booking.hasOne(models.User);
// }

// Booking.associate = (models) => {
//   Booking.hasOne(models.Class);
// }

export default Booking;

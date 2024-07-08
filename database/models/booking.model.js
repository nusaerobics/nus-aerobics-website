import { DataTypes } from "sequelize";
import sequelize from "../utils/sequelize";

const Booking = sequelize.define("booking", {
  bookingDate: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  // TODO: Add in user who made booking and what class it was for by ID
});

export default Booking;

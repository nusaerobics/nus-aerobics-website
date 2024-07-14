
import { DataTypes } from "sequelize";
import sequelize from "../utils/sequelize";

const Booking = sequelize.define("booking", {
  user_id: {
    type: DataTypes.DECIMAL(10, 0),
    allowNull: false,
  },
  class_id: {
    type: DataTypes.DECIMAL(10, 0),
    allowNull: false,
  },
  bookingDate: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

export default Booking;

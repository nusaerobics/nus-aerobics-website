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
  booking_date: {  // TODO: Later change this to just date
    type: DataTypes.STRING,
    allowNull: false,
  },
  attendance: {
    type: DataTypes.ENUM("present", "absent"),
    defaultValue: "absent",
    allowNull: false,
  },
});

export default Booking;

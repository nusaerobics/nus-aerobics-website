import sequelize from "../config/sequelize";
import { DataTypes } from "sequelize";

const Booking = sequelize.define("booking", {
  id: {
    primaryKey: true,
    type: DataTypes.INTEGER.UNSIGNED,
  },
  user_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
  },
  class_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
  },
  attendance: {
    type: DataTypes.ENUM("present", "absent"),
    defaultValue: "absent",
    allowNull: false,
  },
});

export default Booking;

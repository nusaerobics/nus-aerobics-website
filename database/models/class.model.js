import { DataTypes } from "sequelize";
import sequelize from "../utils/sequelize";

const Class = sequelize.define("class", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  max_capacity: {
    type: DataTypes.DECIMAL(10, 0),
    defaultValue: 19,
    allowNull: false,
  },
  booked_capacity: {
    type: DataTypes.DECIMAL(10, 0),
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: "open",
    allowNull: false,
  },
  /**
   * TODO: Would later need to do a JOIN between CLASS and BOOKING and USER
   * to get the USERs who have made a BOOKING for this CLASS
   */
});

export default Class;

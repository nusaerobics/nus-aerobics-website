import sequelize from "../config/sequelize";
import { DataTypes } from "sequelize";

const Class = sequelize.define("class", {
  id: {
    primaryKey: true,
    type: DataTypes.INTEGER.UNSIGNED,
  },
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
    type: DataTypes.INTEGER.UNSIGNED,
    defaultValue: 19,
    allowNull: false,
  },
  booked_capacity: {
    type: DataTypes.INTEGER.UNSIGNED,
    defaultValue: 0,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM("open", "closed"),
    defaultValue: "open",
    allowNull: false,
  },
});

export default Class;

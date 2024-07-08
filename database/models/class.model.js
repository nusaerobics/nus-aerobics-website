import { DataTypes } from "sequelize";
import sequelize from "../utils/sequelize";

const Class = sequelize.define("class", {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  // date: {
  //   type: DataTypes.DATE,
  //   allowNull: false,
  // },
  // maxCapacity: {
  //   type: DataTypes.NUMBER,
  // },
  // bookedCapacity: {
  //   type: DataTypes.NUMBER,
  // }
  // TODO: Add in list of users who are registered for the class by ID
});

// NOTE: How will it know what models is?
// Class.associate = (models) => {
//   Class.hasMany(models.User);
// }

export default Class;

import { DataTypes } from "sequelize";
import sequelize from "../utils/sequelize";

const User = sequelize.define("user", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  // balance: {
  //   type: DataTypes.NUMBER,
  // }
});

// User.associate = (models) => {
//   User.hasMany(models.Booking);
//   User.hasMany(models.Transaction);
// }

export default User;

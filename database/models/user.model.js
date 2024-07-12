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
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  permission: {
    type: DataTypes.STRING,
    defaultValue: "normal",
  },
  balance: {
    type: DataTypes.DECIMAL(10, 0),
    defaultValue: 0,
  }
});

export default User;

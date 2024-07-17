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
    type: DataTypes.ENUM("normal", "admin"),
    defaultValue: "normal",
    allowNull: false,
  },
  balance: {
    type: DataTypes.DECIMAL(10, 0),
    defaultValue: 0,
    allowNull: false,
  }
});

export default User;

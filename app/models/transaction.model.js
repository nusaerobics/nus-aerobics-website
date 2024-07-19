import sequelize from "../config/sequelize";
import { DataTypes } from "sequelize";

const Transaction = sequelize.define("transaction", {
  id: {
    primaryKey: true,
    type: DataTypes.INTEGER.UNSIGNED,
  },
  user_id: {
    // User who's wallet the transaction is affecting
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
  },
  amount: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
  },
  description: {
    type: DataTypes.ENUM("deposit", "refund", "book"),
    allowNull: false,
  },
  class_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: true, // Will be null if description = "deposit", else class that is booked/unbooked
  },
});

export default Transaction;

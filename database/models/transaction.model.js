import { DataTypes } from "sequelize";
import sequelize from "../utils/sequelize";

const Transaction = sequelize.define("transaction", {
  user_id: { // User who's wallet the transaction is affecting
    type: DataTypes.DECIMAL(10, 0),
    allowNull: false,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  amount: {
    type: DataTypes.DECIMAL(10, 0),
    allowNull: false,
  },
  description: {
    type: DataTypes.ENUM("deposit", "refund", "book"),
    allowNull: false,
  },
  class_id: {
    type: DataTypes.DECIMAL(10, 0),
    allowNull: true,  // Will be null if description = "deposit"
  }
});

export default Transaction;

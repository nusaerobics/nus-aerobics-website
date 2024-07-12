
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
    type: DataTypes.ENUM("Deposit", "Refund", "Booking"),
    allowNull: false,
  },
  booking_id: {
    type: DataTypes.DECIMAL(10, 0),
    allowNull: true,
  }
});

export default Transaction;

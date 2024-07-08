import { DataTypes } from "sequelize";
import sequelize from "../utils/sequelize";

const Transaction = sequelize.define("transaction", {
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  // amount: {
  //   type: DataTypes.NUMBER,
  //   allowNull: false,
  // },
  // date: {
  //   type: DataTypes.DATE,
  //   allowNull: false,
  // },
  // TODO: Add user who did the transaction
});

// NOTE: How will it know what models is?
// Transaction.associate = (models) => {
//   Transaction.hasOne(models.User);
// }

export default Transaction;

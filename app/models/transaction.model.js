module.exports = (sequelize, DataTypes) => {
  const Transaction = sequelize.define("transaction", {
    amount: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM("deposit", "refund", "book"),
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
  return Transaction;
};

module.exports = (sequelize, DataTypes) => {
  const Submission = sequelize.define("submission", {
    submissionId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "pending",
    },
  });
  return Submission;
};

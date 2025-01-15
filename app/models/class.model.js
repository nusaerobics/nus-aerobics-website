module.exports = (sequelize, DataTypes) => {
  const Class = sequelize.define("class", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    price: {
      type: DataTypes.INTEGER.UNSIGNED,
      defaultValue: 1,
      allowNull: false,
    },
    maxCapacity: {
      type: DataTypes.INTEGER.UNSIGNED,
      defaultValue: 19,
      allowNull: false,
    },
    bookedCapacity: {
      type: DataTypes.INTEGER.UNSIGNED,
      defaultValue: 0,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("open", "closed"),
      defaultValue: "open",
      allowNull: false,
    },
  });
  return Class;
};

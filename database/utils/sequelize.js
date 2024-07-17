import { Sequelize } from "sequelize";
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    dialectModule: require("mysql2"),
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.classes = require("../models/class.model.js");
db.users = require("../models/user.model.js");
db.transactions = require("../models/transaction.model.js");
db.booking = require("../models/booking.model.js");

(async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
    db.sequelize.sync();
    // await sequelize.sync({ alter: true });  // NOTE: Need to have alter on after editing a Model
  } catch (error) {
    console.error("Unable to establish connection:", error);
  }
})();

export default sequelize;

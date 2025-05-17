const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    dialectModule: require('mysql2'),
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

db.classes = require("../models/class.model")(sequelize, Sequelize);
db.users = require("../models/user.model")(sequelize, Sequelize);
db.bookings = require("../models/booking.model")(sequelize, Sequelize);
db.transactions = require("../models/transaction.model")(sequelize, Sequelize);
db.submissions = require("../models/submission.model")(sequelize, Sequelize);
db.waitlists = require("../models/waitlist.model")(sequelize, Sequelize);

db.classes.hasMany(db.bookings, { as: "bookings" });
db.bookings.belongsTo(db.classes, { as: "class" });

db.users.hasMany(db.bookings, { as: "bookings" });
db.bookings.belongsTo(db.users, { as: "user" });

db.users.hasMany(db.transactions, { as: "transactions" });
db.transactions.belongsTo(db.users, { as: "user" });

db.classes.hasMany(db.waitlists, { as: "waitlists" });
db.waitlists.belongsTo(db.classes, { as: "class" });

db.users.hasMany(db.waitlists, { as: "waitlists" });
db.waitlists.belongsTo(db.users, { as: "user" });

(async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
    await db.sequelize.sync();
    // await sequelize.sync({ alter: true }); // NOTE: Use when altering tables in DB
    // await sequelize.sync({ force: true });  // NOTE: Use when wanting to clear and restart whole DB
  } catch (error) {
    console.error("Unable to establish connection:", error);
  }
})();

module.exports = db;

const { Sequelize } = require("sequelize");

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: process.env.DB_STORAGE || "database.sqlite",
  logging: false,
});

async function connectDB() {
  try {
    await sequelize.authenticate();
    console.log("Database connected");

    await sequelize.sync();
    console.log("Database synced");
  } catch (error) {
    console.error("Database connection error:", error);
  }
}

module.exports = {
  sequelize,
  connectDB,
};

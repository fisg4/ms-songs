const mongoose = require("mongoose");
const DB_URL = process.env.DB_URL || "mongodb://mongo/test";

const dbConnect = () => {
  try {
    console.log("Trying to connect database to: " + DB_URL);
    const db = mongoose.connection;
    db.on("error", console.error.bind(console, "db connection error: "));
    return mongoose.connect(DB_URL, { useNewUrlParser: true });
  } catch (error) {
    console.error(error);
  }
};

module.exports = dbConnect;

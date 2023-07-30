const mongoose = require("mongoose");
const color = require("colors");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log(`Mongodb connected ${mongoose.connection.host}`.bgGreen.white);
  } catch (error) {
    console.log(`Mongooes server Issues: ${error}`.bgRed.white);
  }
};

module.exports = connectDB;

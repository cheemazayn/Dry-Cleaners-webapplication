const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    // Don't crash the whole app in dev if DB isn't ready yet — log and retry-friendly exit.
    process.exit(1);
  }
};

module.exports = connectDB;

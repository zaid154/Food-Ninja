const mongoose = require("mongoose");

const connectDb = async () => {
  try {
    const uri = process.env.CONNECTION_STRING || process.env.MONGO_URI;
    if (!uri) {
      throw new Error("MONGO_URI / CONNECTION_STRING is missing in .env");
    }
    console.log("Connecting to MongoDB Atlas...");
    await mongoose.connect(uri);
    console.log("MongoDB Database connected successfully ✅");
  } catch (error) {
    console.log("Database connection failed ❌:", error.message);
  }
};

module.exports = connectDb;
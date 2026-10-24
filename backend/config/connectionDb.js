const mongoose = require("mongoose");

global.dbStatus = {
  connected: false,
  connecting: false,
  error: null,
  hasUri: false,
};

const connectDb = async () => {
  try {
    const uri = (process.env.MONGO_URI || "").trim();

    if (!uri) {
      global.dbStatus.error = "MONGO_URI is missing in environment variables";
      console.log("Database connection failed: MONGO_URI is missing");
      return;
    }

    global.dbStatus.hasUri = true;
    global.dbStatus.connecting = true;
    console.log("Connecting to MongoDB Atlas...");

    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 8000,
    });

    global.dbStatus.connected = true;
    global.dbStatus.connecting = false;
    global.dbStatus.error = null;
    console.log("MongoDB Database connected successfully");
  } catch (error) {
    global.dbStatus.connected = false;
    global.dbStatus.connecting = false;
    global.dbStatus.error = error.message;
    console.log("Database connection failed:", error.message);
  }
};

mongoose.connection.on("disconnected", () => {
  global.dbStatus.connected = false;
  console.log("MongoDB disconnected, attempting reconnect in 5s...");
  setTimeout(connectDb, 5000);
});

module.exports = connectDb;

const dns = require("dns");
const mongoose = require("mongoose");

const connectMongoUri = async (uri, options = { serverSelectionTimeoutMS: 8000 }) => {
  try {
    return await mongoose.connect(uri, options);
  } catch (error) {
    if (error && (error.code === "EREFUSED" || String(error.message || "").includes("querySrv"))) {
      dns.setServers(["8.8.8.8", "1.1.1.1"]);
      return await mongoose.connect(uri, options);
    }
    throw error;
  }
};

global.dbStatus = {
  connected: false,
  connecting: false,
  error: null,
  hasUri: false,
};

let reconnectHookRegistered = false;
const ensureReconnectHook = () => {
  if (reconnectHookRegistered) return;
  reconnectHookRegistered = true;
  mongoose.connection.on("disconnected", () => {
    global.dbStatus.connected = false;
    console.log("MongoDB disconnected, attempting reconnect in 5s...");
    const timer = setTimeout(connectDb, 5000);
    if (typeof timer.unref === "function") timer.unref();
  });
};

const connectDb = async () => {
  ensureReconnectHook();
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

    await connectMongoUri(uri, {
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

connectDb.connectMongoUri = connectMongoUri;
module.exports = connectDb;

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDb = require("./config/connectionDb");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5005;

// Connect to Database
connectDb();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/recipes", require("./routes/recipe"));
app.use("/api/orders", require("./routes/order"));
app.use("/api/users", require("./routes/user"));

// Database diagnostic and health check
app.get("/api/db-status", (req, res) => {
  const mongoose = require("mongoose");
  const states = ["disconnected", "connected", "connecting", "disconnecting"];
  const uri = process.env.CONNECTION_STRING || process.env.MONGO_URI || "";
  const cleaned = uri.replace(/^["']|["']$/g, "").trim();
  res.json({
    mongooseState: states[mongoose.connection.readyState] || mongoose.connection.readyState,
    dbStatus: global.dbStatus || {},
    hasMongoUri: Boolean(cleaned),
    uriPrefix: cleaned ? cleaned.substring(0, 16) + "..." : "none",
  });
});

app.get("/", (req, res) => {
  const mongoose = require("mongoose");
  const states = ["disconnected", "connected", "connecting", "disconnecting"];
  res.json({
    status: "online",
    message: "Food Ninja Delivery Platform Server is Running Successfully!",
    database: states[mongoose.connection.readyState] || "unknown",
    dbStatus: global.dbStatus || {},
  });
});

// Start Server
app.listen(PORT, () => {
  console.log("=================================================");
  console.log(`Food Ninja Server running at http://localhost:${PORT}`);
  console.log("=================================================");
});

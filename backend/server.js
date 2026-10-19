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

// Contact Form Endpoint
app.post("/api/contact", (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: "Please provide your name, email, and message." });
  }
  console.log(`[Contact Form Received] From: ${name} <${email}> | Subject: ${subject || "General Inquiry"}`);
  res.json({
    success: true,
    message: "Thank you for reaching out! Your message has been received, and our team will get back to you shortly.",
    data: { name, email, subject, receivedAt: new Date().toISOString() }
  });
});

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

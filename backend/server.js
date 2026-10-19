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

// Contact Form & Inquiry Endpoints
const Inquiry = require("./models/inquiry");

app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: "Please provide your name, email, and message." });
    }
    
    let savedInquiry;
    try {
      savedInquiry = await Inquiry.create({
        name,
        email,
        phone: phone || "",
        subject: subject || "General Inquiry",
        message
      });
    } catch (dbErr) {
      console.warn("DB save error for inquiry, continuing:", dbErr.message);
    }

    console.log(`[Contact Form Received] From: ${name} <${email}> | Subject: ${subject || "General Inquiry"}`);
    res.json({
      success: true,
      message: "Thank you for reaching out! Your message has been received, and our team will get back to you shortly.",
      data: savedInquiry || { name, email, subject, receivedAt: new Date().toISOString() }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Admin: Get all customer inquiries
app.get("/api/contact", async (req, res) => {
  try {
    const inquiries = await Inquiry.find().sort({ createdAt: -1 });
    res.json({ success: true, inquiries });
  } catch (error) {
    res.status(500).json({ success: false, inquiries: [], message: error.message });
  }
});

// Admin: Delete an inquiry
app.delete("/api/contact/:id", async (req, res) => {
  try {
    await Inquiry.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Inquiry deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Admin: Reply to an inquiry
app.put("/api/contact/:id/reply", async (req, res) => {
  try {
    const { replyMessage } = req.body;
    if (!replyMessage || !replyMessage.trim()) {
      return res.status(400).json({ success: false, message: "Reply message cannot be empty." });
    }
    const updated = await Inquiry.findByIdAndUpdate(
      req.params.id,
      {
        status: "Replied",
        replyMessage: replyMessage.trim(),
        repliedAt: new Date()
      },
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ success: false, message: "Inquiry not found." });
    }
    console.log(`[Inquiry Replied] ID: ${req.params.id} | To: ${updated.email}`);
    res.json({ success: true, message: "Reply recorded successfully", inquiry: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
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

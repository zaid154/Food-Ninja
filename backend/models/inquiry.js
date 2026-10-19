const mongoose = require("mongoose");

const inquirySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, default: "" },
    subject: { type: String, default: "General Inquiry" },
    message: { type: String, required: true },
    status: { type: String, enum: ["New", "Replied", "Archived"], default: "New" },
    replyMessage: { type: String, default: "" },
    repliedAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Inquiry", inquirySchema);

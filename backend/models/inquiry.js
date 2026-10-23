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
    // Order-specific help fields
    orderId: { type: String, default: "" },
    type: { type: String, enum: ["general", "order_issue"], default: "general" },
    issueCategory: { type: String, default: "" },
    orderStatus: { type: String, default: "" },
    orderTotal: { type: Number, default: 0 },
    priority: { type: String, enum: ["normal", "high", "urgent"], default: "normal" },
    isResolved: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Inquiry", inquirySchema);

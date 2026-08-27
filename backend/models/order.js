const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true },
    userEmail: { type: String, default: "guest" },
    customerName: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    payment: { type: String, default: "Cash on Delivery" },
    items: { type: Array, required: true },
    total: { type: Number, required: true },
    status: {
      type: String,
      enum: ["Placed", "Preparing", "Out for Delivery", "Delivered", "Cancelled"],
      default: "Placed",
    },
    date: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);

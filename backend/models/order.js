const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true },
    userEmail: { type: String, default: "guest" },
    customerName: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    payment: { type: String, default: "Cash on Delivery" },
    paymentStatus: { type: String, default: "Pending" },
    razorpayOrderId: { type: String, default: "" },
    razorpayPaymentId: { type: String, default: "" },
    razorpaySignature: { type: String, default: "" },
    items: { type: Array, required: true },
    subtotal: { type: Number },
    deliveryFee: { type: Number, default: 30 },
    taxes: { type: Number, default: 0 },
    total: { type: Number, required: true },
    estDelivery: { type: String, default: "30–40 mins" },
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

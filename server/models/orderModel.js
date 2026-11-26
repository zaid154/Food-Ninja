const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
    userEmail: { type: String, default: "guest", lowercase: true, trim: true, index: true },
    customerName: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    payment: { type: String, default: "Cash on Delivery" },
    paymentStatus: { type: String, default: "Pending" },
    paymentMethod: { type: String, default: "" },
    razorpayOrderId: { type: String, default: "" },
    razorpayPaymentId: { type: String },
    razorpaySignature: { type: String, default: "" },
    items: { type: Array, required: true },
    subtotal: { type: Number },
    deliveryFee: { type: Number, default: 30 },
    packagingFee: { type: Number },
    taxes: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
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

orderSchema.index(
  { razorpayPaymentId: 1 },
  {
    unique: true,
    partialFilterExpression: { razorpayPaymentId: { $type: "string", $ne: "" } },
  }
);

module.exports = mongoose.model("Order", orderSchema);

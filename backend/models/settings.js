const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema(
  {
    key: { type: String, default: "store_settings", unique: true },
    deliveryFee: { type: Number, default: 30 },
    freeDeliveryThreshold: { type: Number, default: 499 },
    packagingFee: { type: Number, default: 15 },
    taxRate: { type: Number, default: 5 },
    restaurantOpen: { type: Boolean, default: true },
    minOrderValue: { type: Number, default: 99 },
    announcement: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Settings", settingsSchema);

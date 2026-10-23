const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema(
  {
    key: { type: String, default: "store_settings", unique: true },
    restaurantName: { type: String, default: "Food Ninja" },
    fssaiNumber: { type: String, default: "10020011000123" },
    gstinNumber: { type: String, default: "07AAAAF1234A1Z5" },
    storePhone: { type: String, default: "+91 98765 43210" },
    storeEmail: { type: String, default: "support@foodninja.com" },
    storeAddress: { type: String, default: "Shop 12, Food Street, Sector 62, Delhi NCR" },
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

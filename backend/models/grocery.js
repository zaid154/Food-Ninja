const mongoose = require("mongoose");

const grocerySchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "Fresh and quality grocery essential." },
    category: { type: String, default: "Daily Essentials", trim: true },
    price: { type: Number, required: true, default: 49 },
    discountPercentage: { type: Number, default: 10 },
    rating: { type: Number, default: 4.6 },
    stock: { type: Number, default: 50 },
    unit: { type: String, default: "1 Unit" },
    availabilityStatus: { type: String, default: "In Stock" },
    thumbnail: { type: String, required: true },
    images: { type: [String], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Grocery", grocerySchema);

const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true, trim: true },
    category: { type: String, default: "Fast Food", trim: true },
    price: { type: Number, required: true, default: 199 },
    image: { type: String, required: true },
    imageFit: { type: String, default: "cover" },
    isVeg: { type: Boolean, default: true },
    dietary: { type: String, default: "Veg" },
    rating: { type: Number, default: 4.5 },
    reviewCount: { type: Number, default: 120 },
    deliveryTime: { type: String, default: "25-30 mins" },
    cuisine: { type: String, default: "Indian" },
    caloriesPerServing: { type: Number, default: 350 },
    description: { type: String, default: "Delicious and freshly prepared restaurant dish." },
    ingredients: { type: [String], default: [] },
    instructions: { type: [String], default: [] },
    inStock: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Indexes for high-frequency queries, sorting, and search
recipeSchema.index({ category: 1 });
recipeSchema.index({ cuisine: 1 });
recipeSchema.index({ price: 1 });
recipeSchema.index({ rating: -1 });
recipeSchema.index({ name: "text", category: "text", cuisine: "text", description: "text" });

module.exports = mongoose.model("Recipe", recipeSchema);

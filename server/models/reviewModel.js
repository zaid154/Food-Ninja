const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    recipeId: { type: Number, required: true, index: true },
    userName: { type: String, required: true, trim: true },
    userEmail: { type: String, trim: true, lowercase: true, default: "" },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Review", reviewSchema);

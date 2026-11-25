const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, trim: true },
    img: { type: String, default: "" },
    bg: { type: String, default: "bg-[#f4faee]" },
    description: { type: String, default: "" },
    isActive: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    displayOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

categorySchema.index({ isActive: 1, displayOrder: 1 });

module.exports = mongoose.model("Category", categorySchema);

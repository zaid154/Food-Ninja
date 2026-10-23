const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, trim: true },
    img: {
      type: String,
      default: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&auto=format&fit=crop&q=80",
    },
    bg: { type: String, default: "bg-[#f4faee]" },
    description: { type: String, default: "" },
    isActive: { type: Boolean, default: true },
    displayOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

categorySchema.index({ isActive: 1, displayOrder: 1 });

module.exports = mongoose.model("Category", categorySchema);

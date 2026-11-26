const mongoose = require("mongoose");
const Category = require("../models/categoryModel");
const Recipe = require("../models/recipeModel");
const { escapeRegex, isValidHttpUrl } = require("../middleware/securityMiddleware");
const { createCache } = require("../utils/cacheManager");

const categoryCache = createCache({
  name: "categories",
  maxEntries: 16,
  defaultTtlMs: 90_000,
  defaultRefreshAheadRatio: 0.75,
  defaultStaleGraceMs: 30_000,
});

const invalidateCategoryCache = () => categoryCache.invalidatePrefix("categories:");

const slugify = (name) => String(name || "").toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

const getCategories = async (req, res) => {
  try {
    const includeInactive = req.query.includeInactive === "true";
    const featured = req.query.featured === "true";
    const cacheKey = `categories:list:inactive=${includeInactive}:featured=${featured}`;

    const categoriesWithCount = await categoryCache.getOrLoad(cacheKey, async () => {
      const filter = includeInactive ? {} : { isActive: true };
      if (featured) filter.isFeatured = true;

      const [categories, dishCounts] = await Promise.all([
        Category.find(filter).sort({ displayOrder: 1, createdAt: 1 }).lean(),
        Recipe.aggregate([{ $group: { _id: { $toLower: "$category" }, count: { $sum: 1 } } }]),
      ]);

      const countMap = Object.fromEntries(dishCounts.filter((d) => d._id).map((d) => [d._id, d.count]));
      return categories.map((cat) => ({
        ...cat,
        dishCount: countMap[cat.name.toLowerCase()] || 0,
      }));
    });

    return res.status(200).json({ success: true, categories: categoriesWithCount });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to fetch categories", error: error.message });
  }
};

const createCategory = async (req, res) => {
  try {
    const { name, img, bg, description, displayOrder, isFeatured } = req.body || {};
    if (typeof name !== "string" || !name.trim() || name.trim().length > 60) {
      return res.status(400).json({ message: "Valid category name (1–60 characters) is required." });
    }
    if (img !== undefined && !isValidHttpUrl(img, { allowEmpty: true })) {
      return res.status(400).json({ message: "Category image must be a valid http:// or https:// URL." });
    }

    const trimmed = name.trim();
    if (await Category.findOne({ name: new RegExp(`^${escapeRegex(trimmed)}$`, "i") })) {
      return res.status(400).json({ message: `Category "${trimmed}" already exists.` });
    }

    const orderNum = displayOrder !== undefined ? Number(displayOrder) : (await Category.countDocuments()) + 1;
    const newCategory = new Category({
      name: trimmed,
      slug: slugify(trimmed),
      img: typeof img === "string" ? img.trim() : "",
      bg: typeof bg === "string" ? bg.trim().slice(0, 60) : "bg-[#f4faee]",
      description: typeof description === "string" ? description.trim().slice(0, 300) : "",
      displayOrder: Number.isFinite(orderNum) && orderNum >= 0 ? orderNum : 0,
      isActive: true,
      isFeatured: Boolean(isFeatured),
    });

    await newCategory.save();
    invalidateCategoryCache();
    return res.status(201).json({ success: true, message: `Category "${trimmed}" created successfully!`, category: newCategory });
  } catch (error) {
    return res.status(500).json({ message: "Failed to create category", error: error.message });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: "Invalid category ID." });

    const { name, isActive, displayOrder, isFeatured, img, bg, description } = req.body || {};
    if (img !== undefined && !isValidHttpUrl(img, { allowEmpty: true })) {
      return res.status(400).json({ message: "Category image must be a valid http:// or https:// URL." });
    }

    const updateData = {};
    if (typeof name === "string" && name.trim()) {
      updateData.name = name.trim().slice(0, 60);
      updateData.slug = slugify(updateData.name);
    }
    if (img !== undefined) updateData.img = String(img).trim();
    if (bg !== undefined) updateData.bg = String(bg).trim().slice(0, 60);
    if (description !== undefined) updateData.description = String(description).trim().slice(0, 300);
    if (isActive !== undefined) updateData.isActive = Boolean(isActive);
    if (displayOrder !== undefined) {
      const orderNum = Number(displayOrder);
      if (!Number.isFinite(orderNum) || orderNum < 0) return res.status(400).json({ message: "Display order must be non-negative." });
      updateData.displayOrder = orderNum;
    }
    if (isFeatured !== undefined) updateData.isFeatured = Boolean(isFeatured);

    const updated = await Category.findByIdAndUpdate(id, { $set: updateData }, { returnDocument: "after" });
    if (!updated) return res.status(404).json({ message: "Category not found." });
    invalidateCategoryCache();
    return res.status(200).json({ success: true, message: "Category updated successfully!", category: updated });
  } catch (error) {
    return res.status(500).json({ message: "Failed to update category", error: error.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: "Invalid category ID." });

    const deleted = await Category.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Category not found." });
    invalidateCategoryCache();
    return res.status(200).json({ success: true, message: `Category "${deleted.name}" deleted successfully!` });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete category", error: error.message });
  }
};

module.exports = { getCategories, createCategory, updateCategory, deleteCategory, invalidateCategoryCache, categoryCache };

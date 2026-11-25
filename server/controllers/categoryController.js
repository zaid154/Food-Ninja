const Category = require("../models/categoryModel");
const Recipe = require("../models/recipeModel");

const escapeRegex = (string) => (string ? String(string).replace(/[.*+?^${}()|[\]\\]/g, "\\$&") : "");
const slugify = (name) => String(name || "").toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

const getCategories = async (req, res) => {
  try {
    const { includeInactive, featured } = req.query;
    const filter = includeInactive === "true" ? {} : { isActive: true };
    if (featured === "true") filter.isFeatured = true;

    const [categories, dishCounts] = await Promise.all([
      Category.find(filter).sort({ displayOrder: 1, createdAt: 1 }),
      Recipe.aggregate([{ $group: { _id: { $toLower: "$category" }, count: { $sum: 1 } } }])
    ]);

    const countMap = Object.fromEntries(dishCounts.filter((d) => d._id).map((d) => [d._id, d.count]));
    const categoriesWithCount = categories.map((cat) => ({
      ...cat.toObject(), dishCount: countMap[cat.name.toLowerCase()] || 0
    }));

    return res.status(200).json({ success: true, categories: categoriesWithCount });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to fetch categories", error: error.message });
  }
};

const createCategory = async (req, res) => {
  try {
    const { name, img, bg, description, displayOrder, isFeatured } = req.body;
    if (!name?.trim()) return res.status(400).json({ message: "Category name is required." });

    const trimmed = name.trim();
    if (await Category.findOne({ name: new RegExp(`^${escapeRegex(trimmed)}$`, "i") })) {
      return res.status(400).json({ message: `Category "${trimmed}" already exists.` });
    }

    const totalCount = await Category.countDocuments();
    const newCategory = new Category({
      name: trimmed, slug: slugify(trimmed), img: img || "", bg: bg || "bg-[#f4faee]",
      description: description || "", displayOrder: displayOrder !== undefined ? Number(displayOrder) : totalCount + 1,
      isActive: true, isFeatured: Boolean(isFeatured)
    });

    await newCategory.save();
    return res.status(201).json({ success: true, message: `Category "${trimmed}" created successfully!`, category: newCategory });
  } catch (error) {
    return res.status(500).json({ message: "Failed to create category", error: error.message });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, isActive, displayOrder, isFeatured } = req.body || {};
    const updateData = {};
    if (name) {
      updateData.name = name.trim();
      updateData.slug = slugify(name.trim());
    }
    ["img", "bg", "description"].forEach((f) => { if (req.body[f] !== undefined) updateData[f] = req.body[f]; });
    if (isActive !== undefined) updateData.isActive = Boolean(isActive);
    if (displayOrder !== undefined) updateData.displayOrder = Number(displayOrder);
    if (isFeatured !== undefined) updateData.isFeatured = Boolean(isFeatured);

    const updated = await Category.findByIdAndUpdate(id, { $set: updateData }, { new: true });
    if (!updated) return res.status(404).json({ message: "Category not found." });
    return res.status(200).json({ success: true, message: "Category updated successfully!", category: updated });
  } catch (error) {
    return res.status(500).json({ message: "Failed to update category", error: error.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const deleted = await Category.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Category not found." });
    return res.status(200).json({ success: true, message: `Category "${deleted.name}" deleted successfully!` });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete category", error: error.message });
  }
};

module.exports = { getCategories, createCategory, updateCategory, deleteCategory };

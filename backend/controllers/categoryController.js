const Category = require("../models/categoryModel");
const Recipe = require("../models/recipeModel");

// GET /api/categories
const getCategories = async (req, res) => {
  try {
    const { includeInactive, featured } = req.query;
    const filter = includeInactive === "true" ? {} : { isActive: true };
    if (featured === "true") filter.isFeatured = true;

    const categories = await Category.find(filter).sort({ displayOrder: 1, createdAt: 1 });

    const dishCounts = await Recipe.aggregate([
      { $group: { _id: { $toLower: "$category" }, count: { $sum: 1 } } },
    ]);
    const countMap = {};
    dishCounts.forEach((dc) => {
      if (dc._id) countMap[dc._id] = dc.count;
    });

    const categoriesWithCount = categories.map((cat) => ({
      ...cat.toObject(),
      dishCount: countMap[cat.name.toLowerCase()] || 0,
    }));

    return res.status(200).json({ success: true, categories: categoriesWithCount });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to fetch categories", error: error.message });
  }
};

// POST /api/categories (Admin creates category)
const createCategory = async (req, res) => {
  try {
    const { name, img, bg, description, displayOrder, isFeatured } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Category name is required." });
    }

    const trimmedName = name.trim();
    const existing = await Category.findOne({ name: new RegExp(`^${trimmedName}$`, "i") });
    if (existing) {
      return res.status(400).json({ message: `Category "${trimmedName}" already exists.` });
    }

    const totalCount = await Category.countDocuments();
    const newCategory = new Category({
      name: trimmedName,
      slug: trimmedName.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      img: img || "",
      bg: bg || "bg-[#f4faee]",
      description: description || "",
      displayOrder: displayOrder !== undefined ? Number(displayOrder) : totalCount + 1,
      isActive: true,
      isFeatured: Boolean(isFeatured),
    });

    await newCategory.save();
    return res.status(201).json({ success: true, message: `Category "${trimmedName}" created successfully!`, category: newCategory });
  } catch (error) {
    return res.status(500).json({ message: "Failed to create category", error: error.message });
  }
};

// PUT /api/categories/:id (Admin updates category)
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, img, bg, description, isActive, displayOrder, isFeatured } = req.body;

    const updateData = {};
    if (name) {
      updateData.name = name.trim();
      updateData.slug = name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-");
    }
    if (img !== undefined) updateData.img = img;
    if (bg !== undefined) updateData.bg = bg;
    if (description !== undefined) updateData.description = description;
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

// DELETE /api/categories/:id (Admin deletes category)
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

const Category = require("../models/category");
const Recipe = require("../models/recipe");

const DEFAULT_CATEGORIES = [
  {
    name: "Biryani",
    slug: "biryani",
    bg: "bg-[#f4faee]",
    img: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=300&auto=format&fit=crop&q=80",
    description: "Aromatic dum biryanis layered with fragrant basmati rice and rich spices.",
    displayOrder: 1,
    isActive: true,
  },
  {
    name: "Pizza",
    slug: "pizza",
    bg: "bg-[#fff3eb]",
    img: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=300&auto=format&fit=crop&q=80",
    description: "Wood-fired and pan-crust artisanal pizzas with gourmet cheese.",
    displayOrder: 2,
    isActive: true,
  },
  {
    name: "Burgers",
    slug: "burgers",
    bg: "bg-[#fff8e7]",
    img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&auto=format&fit=crop&q=80",
    description: "Juicy grilled patties in toasted brioche buns with signature dressings.",
    displayOrder: 3,
    isActive: true,
  },
  {
    name: "Chinese",
    slug: "chinese",
    bg: "bg-[#fef2f2]",
    img: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=300&auto=format&fit=crop&q=80",
    description: "Sizzling wok tossed noodles, Manchurian, fried rice, and dimsums.",
    displayOrder: 4,
    isActive: true,
  },
  {
    name: "Indian",
    slug: "indian",
    bg: "bg-[#fef9c3]",
    img: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=300&auto=format&fit=crop&q=80",
    description: "Authentic regional specialties from across 24 Indian states.",
    displayOrder: 5,
    isActive: true,
  },
  {
    name: "Italian",
    slug: "italian",
    bg: "bg-[#fdf2f8]",
    img: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=300&auto=format&fit=crop&q=80",
    description: "Classic risottos, creamy fettuccine, lasagna, and authentic tiramisu.",
    displayOrder: 6,
    isActive: true,
  },
  {
    name: "Beverages",
    slug: "beverages",
    bg: "bg-[#f0f9ff]",
    img: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=300&auto=format&fit=crop&q=80",
    description: "Cold-pressed juices, thick milkshakes, mojitos, and specialty teas.",
    displayOrder: 7,
    isActive: true,
  },
];

// Seed default categories if collection is empty
const ensureDefaultCategories = async () => {
  const count = await Category.countDocuments();
  if (count === 0) {
    await Category.insertMany(DEFAULT_CATEGORIES);
    console.log("Seeded initial 7 default food categories.");
  }
};

// GET /api/categories
const getCategories = async (req, res) => {
  try {
    await ensureDefaultCategories();

    const { includeInactive } = req.query;
    const filter = includeInactive === "true" ? {} : { isActive: true };

    const categories = await Category.find(filter).sort({ displayOrder: 1, createdAt: 1 });

    // Calculate dish count per category
    const dishCounts = await Recipe.aggregate([
      { $group: { _id: { $toLower: "$category" }, count: { $sum: 1 } } },
    ]);
    const countMap = {};
    dishCounts.forEach((dc) => {
      if (dc._id) countMap[dc._id] = dc.count;
    });

    const categoriesWithCount = categories.map((cat) => {
      const lower = cat.name.toLowerCase();
      return {
        ...cat.toObject(),
        dishCount: countMap[lower] || 0,
      };
    });

    return res.status(200).json({
      success: true,
      categories: categoriesWithCount,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch categories",
      error: error.message,
    });
  }
};

// POST /api/categories (Admin creates new category)
const createCategory = async (req, res) => {
  try {
    const { name, img, bg, description, displayOrder } = req.body;

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
      img: img || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&auto=format&fit=crop&q=80",
      bg: bg || "bg-[#f4faee]",
      description: description || `Freshly prepared ${trimmedName} specialty items.`,
      displayOrder: displayOrder !== undefined ? Number(displayOrder) : totalCount + 1,
      isActive: true,
    });

    await newCategory.save();
    return res.status(201).json({
      success: true,
      message: `Category "${trimmedName}" created successfully!`,
      category: newCategory,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to create category", error: error.message });
  }
};

// PUT /api/categories/:id (Admin updates category)
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, img, bg, description, isActive, displayOrder } = req.body;

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

    const updated = await Category.findByIdAndUpdate(id, { $set: updateData }, { new: true });
    if (!updated) {
      return res.status(404).json({ message: "Category not found." });
    }

    return res.status(200).json({
      success: true,
      message: "Category updated successfully!",
      category: updated,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to update category", error: error.message });
  }
};

// DELETE /api/categories/:id (Admin deletes category)
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Category.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Category not found." });
    }
    return res.status(200).json({
      success: true,
      message: `Category "${deleted.name}" deleted successfully!`,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete category", error: error.message });
  }
};

module.exports = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};

const Recipe = require("../models/recipe");

// Get food items with server-side pagination, search, category filtering, and sorting
const getRecipes = async (req, res) => {
  try {
    const {
      page: rawPage,
      limit: rawLimit,
      category,
      search,
      sort,
      all,
      popular
    } = req.query;

    // 1. Build Query Filter
    const filter = {};

    // Category / Cuisine filter
    if (category && category.trim() && category.toLowerCase() !== "all") {
      const catRegex = new RegExp(`^${category.trim()}$`, "i");
      filter.$or = [
        { category: catRegex },
        { cuisine: catRegex }
      ];
    }

    // Text Search filter (name, category, cuisine, description)
    if (search && search.trim()) {
      const sRegex = new RegExp(search.trim(), "i");
      const searchConditions = [
        { name: sRegex },
        { category: sRegex },
        { cuisine: sRegex },
        { description: sRegex }
      ];

      if (filter.$or) {
        // If both category and search are present, combine with $and
        filter.$and = [
          { $or: filter.$or },
          { $or: searchConditions }
        ];
        delete filter.$or;
      } else {
        filter.$or = searchConditions;
      }
    }

    // 2. Build Sorting
    let sortObj = { id: -1 };
    if (sort === "price_asc") {
      sortObj = { price: 1, id: 1 };
    } else if (sort === "price_desc") {
      sortObj = { price: -1, id: -1 };
    } else if (sort === "rating" || sort === "rating_desc") {
      sortObj = { rating: -1, id: -1 };
    }

    // 3. Admin / Full bypass check
    if (all === "true") {
      const recipes = await Recipe.find(filter).sort(sortObj);
      return res.status(200).json({
        success: true,
        recipes,
        foods: recipes,
        pagination: {
          currentPage: 1,
          limit: recipes.length,
          totalItems: recipes.length,
          totalPages: 1
        }
      });
    }

    // 4. Server-Side Pagination
    const page = Math.max(1, parseInt(rawPage, 10) || 1);
    const limit = Math.min(24, Math.max(1, parseInt(rawLimit, 10) || 12));
    const skip = (page - 1) * limit;

    const [totalItems, recipes] = await Promise.all([
      Recipe.countDocuments(filter),
      Recipe.find(filter).sort(sortObj).skip(skip).limit(limit)
    ]);

    const totalPages = Math.ceil(totalItems / limit) || 1;

    return res.status(200).json({
      success: true,
      recipes,
      foods: recipes,
      pagination: {
        currentPage: page,
        limit,
        totalItems,
        totalPages
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch food items",
      error: error.message
    });
  }
};

// Get single food item
const getRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findOne({ id: Number(req.params.id) });
    if (!recipe) return res.status(404).json({ message: "Dish not found" });
    return res.status(200).json(recipe);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch dish", error: error.message });
  }
};

// Admin: Add new food item
const addRecipe = async (req, res) => {
  try {
    const { name, category, price, image, isVeg, dietary, deliveryTime, description, ingredients, cuisine } = req.body;
    
    if (!name || !price || !image) {
      return res.status(400).json({ message: "Name, price and image are required." });
    }

    const lastItem = await Recipe.findOne().sort({ id: -1 });
    const nextId = lastItem ? Number(lastItem.id) + 1 : 1;

    const newFood = new Recipe({
      id: nextId,
      name,
      category: category || "Fast Food",
      price: Number(price),
      caloriesPerServing: Number(price),
      image,
      isVeg: isVeg === undefined ? (dietary === "Non-Veg" ? false : true) : Boolean(isVeg),
      dietary: dietary || (isVeg === false ? "Non-Veg" : "Veg"),
      deliveryTime: deliveryTime || "25-30 mins",
      cuisine: cuisine || "Indian",
      rating: 4.8,
      reviewCount: 15,
      description: description || "Freshly made restaurant preparation.",
      ingredients: Array.isArray(ingredients) ? ingredients : (ingredients ? ingredients.split(",").map(s => s.trim()) : ["Fresh Ingredients"]),
      instructions: ["Prepared fresh on order", "Packed hygienically in spill-proof box", "Delivered hot to your doorstep"]
    });

    await newFood.save();
    return res.status(201).json({ message: "Dish added successfully!", food: newFood });
  } catch (error) {
    return res.status(500).json({ message: "Failed to add dish", error: error.message });
  }
};

// Admin: Update food item
const updateRecipe = async (req, res) => {
  try {
    const { name, category, price, image, isVeg, dietary, deliveryTime, description, cuisine } = req.body;
    
    const updateData = {
      name,
      category,
      price: Number(price),
      caloriesPerServing: Number(price),
      image,
      isVeg: isVeg === undefined ? (dietary === "Non-Veg" ? false : true) : Boolean(isVeg),
      dietary: dietary || (isVeg === false ? "Non-Veg" : "Veg"),
      deliveryTime,
      description,
      cuisine
    };

    const updated = await Recipe.findOneAndUpdate(
      { id: Number(req.params.id) },
      { $set: updateData },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Dish not found" });
    return res.status(200).json({ message: "Dish updated successfully!", food: updated });
  } catch (error) {
    return res.status(500).json({ message: "Failed to update dish", error: error.message });
  }
};

// Admin: Delete food item
const deleteRecipe = async (req, res) => {
  try {
    const deleted = await Recipe.findOneAndDelete({ id: Number(req.params.id) });
    if (!deleted) return res.status(404).json({ message: "Dish not found." });
    return res.status(200).json({ message: "Dish deleted successfully!" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete dish", error: error.message });
  }
};

module.exports = { getRecipes, getRecipe, addRecipe, updateRecipe, deleteRecipe };

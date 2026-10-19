const Recipe = require("../models/recipe");

// Get all food items
const getRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find().sort({ id: -1 });
    return res.status(200).json({ recipes });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch food items", error: error.message });
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

const Grocery = require("../models/grocery");

// Get all grocery items
const getGroceries = async (req, res) => {
  try {
    const products = await Grocery.find().sort({ id: -1 });
    return res.status(200).json({ products });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch groceries", error: error.message });
  }
};

// Get single grocery item
const getGrocery = async (req, res) => {
  try {
    const product = await Grocery.findOne({ id: Number(req.params.id) });
    if (!product) return res.status(404).json({ message: "Grocery item not found" });
    return res.status(200).json(product);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch grocery item", error: error.message });
  }
};

// Admin: Add grocery item
const addGrocery = async (req, res) => {
  try {
    const { title, category, price, unit, thumbnail, description } = req.body;
    if (!title || !price || !thumbnail) {
      return res.status(400).json({ message: "Title, price and image are required." });
    }

    const lastItem = await Grocery.findOne().sort({ id: -1 });
    const nextId = lastItem ? Number(lastItem.id) + 1 : 1;

    const newGrocery = new Grocery({
      id: nextId,
      title,
      category: category || "Daily Essentials",
      price: Number(price),
      unit: unit || "1 Unit",
      thumbnail,
      images: [thumbnail],
      description: description || "Fresh grocery item packed with care.",
      rating: 4.7,
      stock: 60,
      availabilityStatus: "In Stock"
    });

    await newGrocery.save();
    return res.status(201).json({ message: "Grocery item added successfully!", product: newGrocery });
  } catch (error) {
    return res.status(500).json({ message: "Failed to add grocery item", error: error.message });
  }
};

// Admin: Update grocery item
const updateGrocery = async (req, res) => {
  try {
    const { title, category, price, unit, thumbnail, description } = req.body;
    
    const updateData = {
      title,
      category,
      price: Number(price),
      unit,
      thumbnail,
      description
    };

    const updated = await Grocery.findOneAndUpdate(
      { id: Number(req.params.id) },
      { $set: updateData },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Grocery item not found" });
    return res.status(200).json({ message: "Grocery item updated successfully!", product: updated });
  } catch (error) {
    return res.status(500).json({ message: "Failed to update grocery item", error: error.message });
  }
};

// Admin: Delete grocery item
const deleteGrocery = async (req, res) => {
  try {
    const deleted = await Grocery.findOneAndDelete({ id: Number(req.params.id) });
    if (!deleted) return res.status(404).json({ message: "Grocery item not found." });
    return res.status(200).json({ message: "Grocery item deleted successfully!" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete grocery item", error: error.message });
  }
};

module.exports = { getGroceries, getGrocery, addGrocery, updateGrocery, deleteGrocery };

const Recipe = require("../models/recipeModel");

const escapeRegex = (string) => (string ? String(string).replace(/[.*+?^${}()|[\]\\]/g, "\\$&") : "");
const optionalNumber = (v) => (v === "" || v === null || v === undefined ? null : Number(v));
const normalizeList = (v) => (Array.isArray(v) ? v.filter(Boolean) : String(v || "").split(/[\n,]/).map((s) => s.trim()).filter(Boolean));
const resolveDishQuery = (rawId) => (!isNaN(Number(rawId)) ? { id: Number(rawId) } : { _id: rawId });

const INDIAN_CUISINES = [
  "indian", "north indian", "south indian", "punjabi", "awadhi", "mughlai", "rajasthani", "kashmiri",
  "himachali", "bihari", "gujarati", "maharashtrian", "goan", "chettinad", "kerala", "hyderabadi",
  "andhra", "karnataka", "bengali", "odisha", "assamese", "naga", "khasi / meghalaya", "kolkata street food", "indo-chinese"
];

const parseDishPayload = (body) => {
  const d = {};
  if (body.name !== undefined) d.name = String(body.name).trim();
  if (body.category !== undefined) d.category = String(body.category).trim() || "Fast Food";
  if (body.price !== undefined) d.price = Number(body.price);
  if (body.image !== undefined) d.image = String(body.image).trim();
  if (body.imageFit !== undefined) d.imageFit = body.imageFit || "cover";
  if (body.isVeg !== undefined || body.dietary !== undefined) {
    d.isVeg = body.isVeg === undefined ? body.dietary !== "Non-Veg" : Boolean(body.isVeg);
    d.dietary = body.dietary || (d.isVeg ? "Veg" : "Non-Veg");
  }
  ["caloriesPerServing", "proteinGrams", "carbsGrams", "fatGrams"].forEach((k) => {
    if (body[k] !== undefined) d[k] = optionalNumber(body[k]);
  });
  ["halfPrice", "quarterPrice", "originalPrice"].forEach((k) => {
    if (body[k] !== undefined) d[k] = Number(body[k]) || 0;
  });
  if (body.hasPortions !== undefined) d.hasPortions = Boolean(body.hasPortions);
  if (body.servingInfo !== undefined) d.servingInfo = String(body.servingInfo).trim();
  if (body.deliveryTime !== undefined) d.deliveryTime = body.deliveryTime || "25-30 mins";
  if (body.cuisine !== undefined) d.cuisine = body.cuisine || "Indian";
  if (body.description !== undefined) d.description = body.description || "Freshly made restaurant preparation.";
  if (body.inStock !== undefined) d.inStock = Boolean(body.inStock);
  if (body.ingredients !== undefined) {
    d.ingredients = Array.isArray(body.ingredients) ? body.ingredients : String(body.ingredients).split(",").map((s) => s.trim()).filter(Boolean);
  }
  if (body.keyFeatures !== undefined) d.keyFeatures = normalizeList(body.keyFeatures);
  return d;
};

const getRecipes = async (req, res) => {
  try {
    const { page: rawPage, limit: rawLimit, category, search, sort, all } = req.query;
    const filter = {};

    if (category && category.trim() && category.toLowerCase() !== "all") {
      const catList = category.split(",").map((c) => c.trim()).filter(Boolean);
      if (catList.length === 1) {
        const catTrim = catList[0];
        if (catTrim.toLowerCase() === "indian") {
          const regexes = INDIAN_CUISINES.map((c) => new RegExp(`^${escapeRegex(c)}$`, "i"));
          filter.$or = [{ category: /indian/i }, { cuisine: { $in: regexes } }];
        } else {
          const catRegex = new RegExp(`^${escapeRegex(catTrim)}$`, "i");
          filter.$or = [{ category: catRegex }, { cuisine: catRegex }];
        }
      } else if (catList.length > 1) {
        const orConditions = [];
        catList.forEach((c) => {
          if (c.toLowerCase() === "indian") {
            const regexes = INDIAN_CUISINES.map((cuis) => new RegExp(`^${escapeRegex(cuis)}$`, "i"));
            orConditions.push({ category: /indian/i });
            orConditions.push({ cuisine: { $in: regexes } });
          } else {
            const r = new RegExp(`^${escapeRegex(c)}$`, "i");
            orConditions.push({ category: r });
            orConditions.push({ cuisine: r });
          }
        });
        filter.$or = orConditions;
      }
    }

    if (search && search.trim()) {
      const sRegex = new RegExp(escapeRegex(search.trim()), "i");
      const searchConditions = [{ name: sRegex }, { category: sRegex }, { cuisine: sRegex }, { description: sRegex }];
      if (filter.$or) {
        filter.$and = [{ $or: filter.$or }, { $or: searchConditions }];
        delete filter.$or;
      } else {
        filter.$or = searchConditions;
      }
    }

    let sortObj = { id: -1 };
    if (sort === "price_asc") sortObj = { price: 1, id: 1 };
    else if (sort === "price_desc") sortObj = { price: -1, id: -1 };
    else if (sort === "rating" || sort === "rating_desc") sortObj = { rating: -1, id: -1 };

    if (all === "true") {
      const recipes = await Recipe.find(filter).sort(sortObj);
      return res.status(200).json({
        success: true, recipes, foods: recipes,
        pagination: { currentPage: 1, limit: recipes.length, totalItems: recipes.length, totalPages: 1 }
      });
    }

    const page = Math.max(1, parseInt(rawPage, 10) || 1);
    const limit = Math.min(24, Math.max(1, parseInt(rawLimit, 10) || 12));
    const skip = (page - 1) * limit;

    const [totalItems, recipes] = await Promise.all([
      Recipe.countDocuments(filter),
      Recipe.find(filter).sort(sortObj).skip(skip).limit(limit)
    ]);

    return res.status(200).json({
      success: true, recipes, foods: recipes,
      pagination: { currentPage: page, limit, totalItems, totalPages: Math.ceil(totalItems / limit) || 1 }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to fetch food items", error: error.message });
  }
};

const getRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findOne(resolveDishQuery(req.params.id));
    if (!recipe) return res.status(404).json({ message: "Food item not found." });
    return res.status(200).json(recipe);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch food item", error: error.message });
  }
};

const addRecipe = async (req, res) => {
  try {
    const { name, price, image } = req.body;
    if (!name || !price || !image) return res.status(400).json({ message: "Name, price and image are required." });

    const lastItem = await Recipe.findOne().sort({ id: -1 });
    const nextId = lastItem ? Number(lastItem.id) + 1 : 1;
    const payload = parseDishPayload(req.body);

    const newFood = new Recipe({
      id: nextId, rating: 4.8, reviewCount: 15,
      instructions: ["Prepared fresh on order", "Packed hygienically in spill-proof box", "Delivered hot to your doorstep"],
      ...payload
    });

    await newFood.save();
    return res.status(201).json({ message: "Dish added successfully!", food: newFood });
  } catch (error) {
    return res.status(500).json({ message: "Failed to add dish", error: error.message });
  }
};

const updateRecipe = async (req, res) => {
  try {
    const updateData = parseDishPayload(req.body);
    const updated = await Recipe.findOneAndUpdate(resolveDishQuery(req.params.id), { $set: updateData }, { new: true });
    if (!updated) return res.status(404).json({ message: "Dish not found" });
    return res.status(200).json({ message: "Dish updated successfully!", food: updated });
  } catch (error) {
    return res.status(500).json({ message: "Failed to update dish", error: error.message });
  }
};

const updateRecipeStock = async (req, res) => {
  try {
    const existing = await Recipe.findOne(resolveDishQuery(req.params.id));
    if (!existing) return res.status(404).json({ message: "Dish not found" });

    const nextStock = req.body.inStock !== undefined ? Boolean(req.body.inStock) : !existing.inStock;
    existing.inStock = nextStock;
    await existing.save();

    return res.status(200).json({
      message: `Dish is now ${nextStock ? "In Stock" : "Sold Out"}`,
      dish: existing, food: existing
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to update stock status", error: error.message });
  }
};

const deleteRecipe = async (req, res) => {
  try {
    const deleted = await Recipe.findOneAndDelete(resolveDishQuery(req.params.id));
    if (!deleted) return res.status(404).json({ message: "Dish not found" });
    return res.status(200).json({ message: "Dish deleted successfully!" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete dish", error: error.message });
  }
};

module.exports = { getRecipes, getRecipe, addRecipe, updateRecipe, updateRecipeStock, deleteRecipe };

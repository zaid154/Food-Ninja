const mongoose = require("mongoose");
const Recipe = require("../models/recipeModel");
const { escapeRegex, isValidHttpUrl } = require("../middleware/securityMiddleware");
const { createCache } = require("../utils/cacheManager");
const { invalidateCategoryCache } = require("./categoryController");

const recipeCache = createCache({
  name: "recipes",
  maxEntries: 150,
  defaultTtlMs: 45_000,
  defaultRefreshAheadRatio: 0.75,
  defaultStaleGraceMs: 20_000,
});

const invalidateRecipeCaches = () => {
  recipeCache.invalidatePrefix("recipes:");
  recipeCache.invalidatePrefix("recipe:");
  invalidateCategoryCache();
};

const optionalNumber = (v) => {
  if (v === "" || v === null || v === undefined) return null;
  const num = Number(v);
  return Number.isFinite(num) && num >= 0 ? num : null;
};

const normalizeList = (v) =>
  Array.isArray(v)
    ? v.map((item) => String(item || "").trim()).filter(Boolean)
    : String(v || "").split(/[\n,]/).map((s) => s.trim()).filter(Boolean);

const resolveDishQuery = (rawId) => {
  if (typeof rawId !== "string" && typeof rawId !== "number") return null;
  const trimmed = String(rawId).trim();
  if (/^\d+$/.test(trimmed)) return { id: Number(trimmed) };
  if (mongoose.isValidObjectId(trimmed)) return { _id: trimmed };
  return null;
};

const INDIAN_CUISINES = [
  "indian", "north indian", "south indian", "punjabi", "awadhi", "mughlai", "rajasthani", "kashmiri",
  "himachali", "bihari", "gujarati", "maharashtrian", "goan", "chettinad", "kerala", "hyderabadi",
  "andhra", "karnataka", "bengali", "odisha", "assamese", "naga", "khasi / meghalaya", "kolkata street food", "indo-chinese",
];

const parseDishPayload = (body) => {
  const d = {};
  if (body.name !== undefined) {
    const cleanName = String(body.name).trim();
    if (!cleanName || cleanName.length > 140) {
      const err = new Error("Dish name must be between 1 and 140 characters.");
      err.status = 400;
      throw err;
    }
    d.name = cleanName;
  }
  if (body.category !== undefined) d.category = String(body.category).trim().slice(0, 60) || "Fast Food";
  if (body.price !== undefined) {
    const price = Number(body.price);
    if (!Number.isFinite(price) || price <= 0 || price > 100000) {
      const err = new Error("Dish price must be a positive number.");
      err.status = 400;
      throw err;
    }
    d.price = price;
  }
  if (body.image !== undefined) {
    const imgUrl = String(body.image).trim();
    if (!isValidHttpUrl(imgUrl, { allowEmpty: false })) {
      const err = new Error("Image must be a valid http:// or https:// URL.");
      err.status = 400;
      throw err;
    }
    d.image = imgUrl;
  }
  if (body.imageFit !== undefined) d.imageFit = body.imageFit === "contain" ? "contain" : "cover";
  if (body.isVeg !== undefined || body.dietary !== undefined) {
    d.isVeg = body.isVeg === undefined ? body.dietary !== "Non-Veg" : Boolean(body.isVeg);
    d.dietary = ["Veg", "Non-Veg", "Vegan"].includes(body.dietary) ? body.dietary : (d.isVeg ? "Veg" : "Non-Veg");
  }
  ["caloriesPerServing", "proteinGrams", "carbsGrams", "fatGrams"].forEach((k) => {
    if (body[k] !== undefined) d[k] = optionalNumber(body[k]);
  });
  ["halfPrice", "quarterPrice", "originalPrice"].forEach((k) => {
    if (body[k] !== undefined) {
      const val = Number(body[k] || 0);
      if (!Number.isFinite(val) || val < 0 || val > 100000) {
        const err = new Error(`${k} must be a non-negative number.`);
        err.status = 400;
        throw err;
      }
      d[k] = val;
    }
  });
  if (body.hasPortions !== undefined) d.hasPortions = Boolean(body.hasPortions);
  if (body.servingInfo !== undefined) d.servingInfo = String(body.servingInfo).trim().slice(0, 200);
  if (body.deliveryTime !== undefined) d.deliveryTime = String(body.deliveryTime).trim().slice(0, 50) || "25-30 mins";
  if (body.cuisine !== undefined) d.cuisine = String(body.cuisine).trim().slice(0, 60) || "Indian";
  if (body.description !== undefined) d.description = String(body.description).trim().slice(0, 1500) || "Freshly made restaurant preparation.";
  if (body.inStock !== undefined) d.inStock = Boolean(body.inStock);
  if (body.ingredients !== undefined) {
    d.ingredients = Array.isArray(body.ingredients)
      ? body.ingredients.map((i) => String(i || "").trim()).filter(Boolean)
      : String(body.ingredients).split(",").map((s) => s.trim()).filter(Boolean);
  }
  if (body.keyFeatures !== undefined) d.keyFeatures = normalizeList(body.keyFeatures);
  return d;
};

const getRecipes = async (req, res) => {
  try {
    const { page: rawPage, limit: rawLimit, category, search, sort, all } = req.query;
    const filter = {};

    const searchTrim = typeof search === "string" ? search.trim().slice(0, 100) : "";
    const catList = typeof category === "string" && category.trim() && category.toLowerCase() !== "all"
      ? category.slice(0, 200).split(",").map((c) => c.trim()).filter(Boolean).slice(0, 20)
      : [];

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

    if (searchTrim) {
      const sRegex = new RegExp(escapeRegex(searchTrim), "i");
      const searchConditions = [{ name: sRegex }, { category: sRegex }, { cuisine: sRegex }, { description: sRegex }];
      if (filter.$or) {
        filter.$and = [{ $or: filter.$or }, { $or: searchConditions }];
        delete filter.$or;
      } else {
        filter.$or = searchConditions;
      }
    }

    let sortObj = { id: -1 };
    const normalizedSort = typeof sort === "string" && ["price_asc", "price_desc", "rating", "rating_desc"].includes(sort) ? sort : "default";
    if (normalizedSort === "price_asc") sortObj = { price: 1, id: 1 };
    else if (normalizedSort === "price_desc") sortObj = { price: -1, id: -1 };
    else if (normalizedSort === "rating" || normalizedSort === "rating_desc") sortObj = { rating: -1, id: -1 };

    const canonicalCats = [...catList].map((c) => c.toLowerCase()).sort().join(",") || "all";
    const isAll = all === "true";
    const page = isAll ? 1 : Math.max(1, parseInt(rawPage, 10) || 1);
    const limit = isAll ? 500 : Math.min(24, Math.max(1, parseInt(rawLimit, 10) || 12));

    const cacheKey = searchTrim
      ? `recipes:search:c=${canonicalCats}:s=${searchTrim.toLowerCase()}:sort=${normalizedSort}:all=${isAll}:p=${page}:l=${limit}`
      : `recipes:list:c=${canonicalCats}:sort=${normalizedSort}:all=${isAll}:p=${page}:l=${limit}`;

    const cacheOpts = searchTrim
      ? { ttlMs: 10_000, refreshAheadRatio: 0.8, staleGraceMs: 0 }
      : { ttlMs: 45_000, refreshAheadRatio: 0.75, staleGraceMs: 20_000 };

    const payload = await recipeCache.getOrLoad(
      cacheKey,
      async () => {
        if (isAll) {
          const recipes = await Recipe.find(filter).sort(sortObj).limit(500).lean();
          return {
            success: true,
            recipes,
            foods: recipes,
            pagination: { currentPage: 1, limit: recipes.length, totalItems: recipes.length, totalPages: 1 },
          };
        }

        const skip = (page - 1) * limit;
        const [totalItems, recipes] = await Promise.all([
          Recipe.countDocuments(filter),
          Recipe.find(filter).sort(sortObj).skip(skip).limit(limit).lean(),
        ]);

        return {
          success: true,
          recipes,
          foods: recipes,
          pagination: { currentPage: page, limit, totalItems, totalPages: Math.ceil(totalItems / limit) || 1 },
        };
      },
      cacheOpts
    );

    return res.status(200).json(payload);
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to fetch food items", error: error.message });
  }
};

const getRecipe = async (req, res) => {
  try {
    const query = resolveDishQuery(req.params.id);
    if (!query) return res.status(404).json({ message: "Food item not found." });

    const itemKey = query.id !== undefined ? `recipe:id:${query.id}` : `recipe:_id:${query._id}`;
    const recipe = await recipeCache.getOrLoad(
      itemKey,
      () => Recipe.findOne(query).lean(),
      { shouldCache: (doc) => doc !== null && doc !== undefined }
    );
    if (!recipe) return res.status(404).json({ message: "Food item not found." });
    return res.status(200).json(recipe);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch food item", error: error.message });
  }
};

const addRecipe = async (req, res) => {
  try {
    const { name, price, image } = req.body || {};
    if (!name || price === undefined || !image) {
      return res.status(400).json({ message: "Name, price and image are required." });
    }

    const payload = parseDishPayload(req.body);
    const lastItem = await Recipe.findOne().sort({ id: -1 });
    const nextId = lastItem ? Number(lastItem.id) + 1 : 1;

    const newFood = new Recipe({
      id: nextId,
      rating: 4.8,
      reviewCount: 0,
      instructions: ["Prepared fresh on order", "Packed hygienically in spill-proof box", "Delivered hot to your doorstep"],
      ...payload,
    });

    await newFood.save();
    invalidateRecipeCaches();
    return res.status(201).json({ message: "Dish added successfully!", food: newFood });
  } catch (error) {
    return res.status(error.status || 500).json({ message: error.message || "Failed to add dish" });
  }
};

const updateRecipe = async (req, res) => {
  try {
    const query = resolveDishQuery(req.params.id);
    if (!query) return res.status(404).json({ message: "Dish not found" });

    const updateData = parseDishPayload(req.body || {});
    const updated = await Recipe.findOneAndUpdate(query, { $set: updateData }, { returnDocument: "after" });
    if (!updated) return res.status(404).json({ message: "Dish not found" });
    invalidateRecipeCaches();
    return res.status(200).json({ message: "Dish updated successfully!", food: updated });
  } catch (error) {
    return res.status(error.status || 500).json({ message: error.message || "Failed to update dish" });
  }
};

const updateRecipeStock = async (req, res) => {
  try {
    const query = resolveDishQuery(req.params.id);
    if (!query) return res.status(404).json({ message: "Dish not found" });

    const existing = await Recipe.findOne(query);
    if (!existing) return res.status(404).json({ message: "Dish not found" });

    const nextStock = req.body?.inStock !== undefined ? Boolean(req.body.inStock) : !existing.inStock;
    existing.inStock = nextStock;
    await existing.save();
    invalidateRecipeCaches();

    return res.status(200).json({
      message: `Dish is now ${nextStock ? "In Stock" : "Sold Out"}`,
      dish: existing,
      food: existing,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to update stock status", error: error.message });
  }
};

const deleteRecipe = async (req, res) => {
  try {
    const query = resolveDishQuery(req.params.id);
    if (!query) return res.status(404).json({ message: "Dish not found" });

    const deleted = await Recipe.findOneAndDelete(query);
    if (!deleted) return res.status(404).json({ message: "Dish not found" });
    invalidateRecipeCaches();
    return res.status(200).json({ message: "Dish deleted successfully!" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete dish", error: error.message });
  }
};

module.exports = { getRecipes, getRecipe, addRecipe, updateRecipe, updateRecipeStock, deleteRecipe, invalidateRecipeCaches, recipeCache };

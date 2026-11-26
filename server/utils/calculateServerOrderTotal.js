const mongoose = require("mongoose");
const Recipe = require("../models/recipeModel");
const Settings = require("../models/settingsModel");

const toFiniteNonNegative = (value, fallback = 0) => {
  if (value === undefined || value === null || value === "") return fallback;
  const num = Number(value);
  return Number.isFinite(num) && num >= 0 ? num : fallback;
};

const VALID_PORTIONS = new Set(["", "Full", "Half", "Quarter"]);

const resolveItemPricing = async (rawItems) => {
  if (!Array.isArray(rawItems) || rawItems.length === 0) {
    return { errorStatus: 400, errorMessage: "Order must include at least one item." };
  }
  if (rawItems.length > 50) {
    return { errorStatus: 400, errorMessage: "Order exceeds maximum allowed items (50)." };
  }

  const normalizedRequests = [];
  const numericIds = [];
  const objectIds = [];

  for (const item of rawItems) {
    if (!item || typeof item !== "object") {
      return { errorStatus: 400, errorMessage: "Invalid cart item format." };
    }

    const rawQty = item.quantity === undefined ? 1 : item.quantity;
    const qty = typeof rawQty === "boolean" ? NaN : Number(rawQty);
    if (!Number.isInteger(qty) || qty < 1 || qty > 50) {
      return { errorStatus: 400, errorMessage: "Each item quantity must be an integer between 1 and 50." };
    }

    const portionSize = typeof item.portionSize === "string" ? item.portionSize.trim() : "";
    if (!VALID_PORTIONS.has(portionSize)) {
      return { errorStatus: 400, errorMessage: `Invalid portion size "${portionSize}".` };
    }

    const rawMongoId = item._id;
    const rawNumId = item.id;
    const numId = rawNumId !== undefined && rawNumId !== null && typeof rawNumId !== "boolean" && rawNumId !== ""
      ? Number(rawNumId)
      : NaN;

    if (Number.isInteger(numId) && numId > 0) {
      numericIds.push(numId);
    } else if (typeof rawMongoId === "string" && mongoose.isValidObjectId(rawMongoId)) {
      objectIds.push(rawMongoId);
    } else if (typeof rawNumId === "string" && mongoose.isValidObjectId(rawNumId)) {
      objectIds.push(rawNumId);
    } else {
      return { errorStatus: 400, errorMessage: "Each item must reference a valid dish ID." };
    }

    normalizedRequests.push({
      numId: Number.isInteger(numId) && numId > 0 ? numId : null,
      objId: (typeof rawMongoId === "string" && mongoose.isValidObjectId(rawMongoId))
        ? rawMongoId
        : (typeof rawNumId === "string" && mongoose.isValidObjectId(rawNumId) ? rawNumId : null),
      qty,
      portionSize,
    });
  }

  const orClauses = [];
  if (numericIds.length > 0) orClauses.push({ id: { $in: numericIds } });
  if (objectIds.length > 0) orClauses.push({ _id: { $in: objectIds } });

  const dishes = await Recipe.find({ $or: orClauses }).lean();
  const byNumId = new Map(dishes.map((d) => [d.id, d]));
  const byObjId = new Map(dishes.map((d) => [String(d._id), d]));

  const verifiedItems = [];
  let subtotal = 0;
  let itemCount = 0;

  for (const reqItem of normalizedRequests) {
    const dish = (reqItem.numId !== null && byNumId.get(reqItem.numId))
      || (reqItem.objId && byObjId.get(reqItem.objId));

    if (!dish) {
      return { errorStatus: 400, errorMessage: "One or more dishes in your cart no longer exist." };
    }
    if (dish.inStock === false) {
      return { errorStatus: 400, errorMessage: `"${dish.name}" is currently sold out.` };
    }

    let finalPortion = "";
    let unitPrice = Number(dish.price);

    if (dish.hasPortions) {
      const requestedPortion = reqItem.portionSize || "Full";
      if (requestedPortion === "Full") {
        unitPrice = Number(dish.price);
        finalPortion = "Full";
      } else if (requestedPortion === "Half" && Number(dish.halfPrice) > 0) {
        unitPrice = Number(dish.halfPrice);
        finalPortion = "Half";
      } else if (requestedPortion === "Quarter" && Number(dish.quarterPrice) > 0) {
        unitPrice = Number(dish.quarterPrice);
        finalPortion = "Quarter";
      } else {
        return { errorStatus: 400, errorMessage: `Portion "${requestedPortion}" is not available for "${dish.name}".` };
      }
    }

    if (!Number.isFinite(unitPrice) || unitPrice <= 0) {
      return { errorStatus: 400, errorMessage: `Dish "${dish.name}" has an invalid price configuration.` };
    }

    subtotal += unitPrice * reqItem.qty;
    itemCount += reqItem.qty;

    verifiedItems.push({
      id: dish.id,
      _id: dish._id,
      name: dish.name,
      image: dish.image,
      category: dish.category,
      isVeg: dish.isVeg,
      dietary: dish.dietary,
      portionSize: finalPortion,
      hasPortions: Boolean(dish.hasPortions),
      price: unitPrice,
      caloriesPerServing: dish.caloriesPerServing ?? null,
      quantity: reqItem.qty,
    });
  }

  const settings = (await Settings.findOne({ key: "store_settings" }).lean()) || {};
  const minOrderValue = toFiniteNonNegative(settings.minOrderValue, 0);
  if (minOrderValue > 0 && subtotal < minOrderValue) {
    return {
      errorStatus: 400,
      errorMessage: `Minimum order value is ₹${minOrderValue}. Please add more dishes to proceed.`,
    };
  }

  const freeDeliveryThreshold = toFiniteNonNegative(settings.freeDeliveryThreshold, 499);
  const isFreeDelivery = subtotal >= freeDeliveryThreshold;
  const deliveryFee = isFreeDelivery ? 0 : toFiniteNonNegative(settings.deliveryFee, 30);
  const packagingFee = toFiniteNonNegative(settings.packagingFee, 15);
  const taxRate = Math.min(30, toFiniteNonNegative(settings.taxRate, 5));
  const taxes = Math.round((subtotal * taxRate) / 100);
  const discount = 0; // No promo/coupon feature; never accept client-supplied discounts
  const total = Math.max(0, subtotal + deliveryFee + packagingFee + taxes - discount);

  if (!Number.isFinite(total) || total <= 0) {
    return { errorStatus: 400, errorMessage: "Calculated order total must be greater than zero." };
  }

  return {
    items: verifiedItems,
    itemCount,
    subtotal,
    deliveryFee,
    packagingFee,
    taxRate,
    taxes,
    discount,
    total,
    settings,
  };
};

module.exports = { resolveItemPricing };

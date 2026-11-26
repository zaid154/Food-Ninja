const Review = require("../models/reviewModel");
const Recipe = require("../models/recipeModel");
const Order = require("../models/orderModel");
const { createCache } = require("../utils/cacheManager");
const { invalidateRecipeCaches } = require("./recipeController");

const reviewCache = createCache({
  name: "reviews",
  maxEntries: 150,
  defaultTtlMs: 45_000,
  defaultRefreshAheadRatio: 0.75,
  defaultStaleGraceMs: 15_000,
});

const calcRating = (reviews) => {
  const count = reviews.length;
  const avg = count ? Number((reviews.reduce((s, r) => s + r.rating, 0) / count).toFixed(1)) : null;
  return { count, avg };
};

const buildOwnerFilter = (user) => ({
  $or: [{ userId: user._id }, { userEmail: user.email.toLowerCase() }],
});

const getReviewsForRecipe = async (req, res) => {
  try {
    const recipeId = Number(req.params.id);
    if (!Number.isInteger(recipeId) || recipeId <= 0) {
      return res.status(400).json({ success: false, message: "Invalid dish ID" });
    }

    const payload = await reviewCache.getOrLoad(`reviews:${recipeId}`, async () => {
      const reviews = await Review.find({ recipeId }).sort({ createdAt: -1 }).lean();
      const { count, avg } = calcRating(reviews);
      return { success: true, count, averageRating: avg, reviews };
    });

    return res.status(200).json(payload);
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to fetch reviews", error: error.message });
  }
};

const checkReviewEligibility = async (req, res) => {
  try {
    const recipeId = Number(req.params.id);
    if (!Number.isInteger(recipeId) || recipeId <= 0) {
      return res.status(400).json({ success: false, message: "Invalid dish ID" });
    }

    if (!req.user) {
      return res.status(200).json({
        success: true,
        eligible: false,
        reason: "not_logged_in",
        message: "Log in with your registered email to check review eligibility.",
      });
    }

    const cleanEmail = req.user.email.trim().toLowerCase();
    const ownerFilter = buildOwnerFilter(req.user);

    const [existingReview, deliveredOrder, pendingOrder] = await Promise.all([
      Review.findOne({ recipeId, userEmail: cleanEmail }),
      Order.findOne({ ...ownerFilter, status: "Delivered", items: { $elemMatch: { id: recipeId } } }),
      Order.findOne({ ...ownerFilter, status: { $in: ["Placed", "Preparing", "Out for Delivery"] }, items: { $elemMatch: { id: recipeId } } }),
    ]);

    if (deliveredOrder) {
      return res.status(200).json({
        success: true,
        eligible: true,
        alreadyReviewed: Boolean(existingReview),
        orderId: deliveredOrder.id,
        message: existingReview
          ? "You have already reviewed this delivered dish."
          : "Verified Buyer: Order delivered! You are verified to write a review.",
      });
    }

    if (pendingOrder) {
      return res.status(200).json({
        success: true,
        eligible: false,
        reason: "order_pending",
        orderId: pendingOrder.id,
        message: `Your order #${pendingOrder.id} is currently ${pendingOrder.status}. Review will unlock once your order is Delivered!`,
      });
    }

    return res.status(200).json({
      success: true,
      eligible: false,
      reason: "not_ordered",
      message: "Only verified customers who have ordered and received this dish can write a review.",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to check review eligibility", error: error.message });
  }
};

const addReviewForRecipe = async (req, res) => {
  try {
    const recipeId = Number(req.params.id);
    if (!Number.isInteger(recipeId) || recipeId <= 0) {
      return res.status(400).json({ success: false, message: "Invalid dish ID" });
    }

    const dish = await Recipe.findOne({ id: recipeId }).select("id").lean();
    if (!dish) {
      return res.status(404).json({ success: false, message: "Dish not found." });
    }

    const { rating, comment } = req.body || {};
    const numRating = Number(rating);
    if (!Number.isInteger(numRating) || numRating < 1 || numRating > 5) {
      return res.status(400).json({ success: false, message: "Rating must be a whole number between 1 and 5." });
    }
    if (typeof comment !== "string" || comment.trim().length < 2 || comment.trim().length > 1000) {
      return res.status(400).json({ success: false, message: "Review comment must be between 2 and 1000 characters." });
    }

    const cleanEmail = req.user.email.trim().toLowerCase();
    const reviewerName = (req.user.name || cleanEmail.split("@")[0] || "Verified Buyer").trim();

    const deliveredOrder = await Order.findOne({
      ...buildOwnerFilter(req.user),
      status: "Delivered",
      items: { $elemMatch: { id: recipeId } },
    }).select("id").lean();

    if (!deliveredOrder) {
      return res.status(403).json({
        success: false,
        message: "Review blocked: Only authenticated customers whose order has been Delivered can write a review for this dish.",
      });
    }

    const existingReview = await Review.findOne({ recipeId, userEmail: cleanEmail }).select("_id").lean();
    if (existingReview) {
      return res.status(409).json({ success: false, message: "You have already submitted a review for this dish." });
    }

    const newReview = await Review.create({
      recipeId,
      userName: reviewerName,
      userEmail: cleanEmail,
      rating: numRating,
      comment: comment.trim(),
    });

    const allReviews = await Review.find({ recipeId }).lean();
    const { count, avg } = calcRating(allReviews);
    await Recipe.findOneAndUpdate({ id: recipeId }, { rating: avg, reviewCount: count });
    reviewCache.invalidate(`reviews:${recipeId}`);
    invalidateRecipeCaches();

    return res.status(201).json({
      success: true,
      message: "Review submitted successfully!",
      review: newReview,
      averageRating: avg,
      totalReviews: count,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to submit review", error: error.message });
  }
};

module.exports = { getReviewsForRecipe, checkReviewEligibility, addReviewForRecipe, reviewCache };

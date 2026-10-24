const Review = require("../models/review");
const Recipe = require("../models/recipe");
const Order = require("../models/order");

// Helper to calculate rating statistics
const calcRating = (reviews) => {
  const count = reviews.length;
  const avg = count ? Number((reviews.reduce((s, r) => s + r.rating, 0) / count).toFixed(1)) : null;
  return { count, avg };
};

// GET /api/reviews/dish/:id
const getReviewsForRecipe = async (req, res) => {
  try {
    const recipeId = Number(req.params.id);
    if (isNaN(recipeId)) return res.status(400).json({ success: false, message: "Invalid dish ID" });

    const reviews = await Review.find({ recipeId }).sort({ createdAt: -1 });
    const { count, avg } = calcRating(reviews);

    return res.status(200).json({ success: true, count, averageRating: avg, reviews });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to fetch reviews", error: error.message });
  }
};

// GET /api/reviews/eligibility/:id
const checkReviewEligibility = async (req, res) => {
  try {
    const recipeId = Number(req.params.id);
    const { email } = req.query;
    if (isNaN(recipeId)) return res.status(400).json({ success: false, message: "Invalid dish ID" });

    if (!email || !email.trim()) {
      return res.status(200).json({ success: true, eligible: false, reason: "not_logged_in", message: "Log in with your registered email to check review eligibility." });
    }

    const cleanEmail = email.trim().toLowerCase();
    if (cleanEmail === "admin@foodninja.com") {
      return res.status(200).json({ success: true, eligible: true, orderId: 999999, message: "Store Administrator: Review authorization granted." });
    }

    const [existingReview, deliveredOrder, pendingOrder] = await Promise.all([
      Review.findOne({ recipeId, userEmail: cleanEmail }),
      Order.findOne({ userEmail: cleanEmail, status: "Delivered", items: { $elemMatch: { id: recipeId } } }),
      Order.findOne({ userEmail: cleanEmail, status: { $in: ["Placed", "Preparing", "Out for Delivery"] }, items: { $elemMatch: { id: recipeId } } }),
    ]);

    if (deliveredOrder) {
      return res.status(200).json({
        success: true,
        eligible: true,
        alreadyReviewed: Boolean(existingReview),
        orderId: deliveredOrder.id,
        message: existingReview ? "You have already reviewed this delivered dish." : "Verified Buyer: Order delivered! You are verified to write a review.",
      });
    }

    if (pendingOrder) {
      return res.status(200).json({
        success: true,
        eligible: false,
        reason: "order_pending",
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

// POST /api/reviews/dish/:id
const addReviewForRecipe = async (req, res) => {
  try {
    const recipeId = Number(req.params.id);
    const { userName, userEmail, rating, comment, orderId } = req.body;
    const numRating = Number(rating);

    if (isNaN(recipeId)) return res.status(400).json({ success: false, message: "Invalid dish ID" });
    if (!userName?.trim() || !comment?.trim() || !numRating || numRating < 1 || numRating > 5) {
      return res.status(400).json({ success: false, message: "Name, comment, and a rating between 1 and 5 are required." });
    }

    const cleanEmail = (userEmail || "").trim().toLowerCase();
    const isAdmin = cleanEmail === "admin@foodninja.com";

    // Strict Delivered Order Verification
    let isDelivered = isAdmin;
    if (!isDelivered) {
      const matchCriteria = { status: "Delivered", items: { $elemMatch: { id: recipeId } } };
      const orClauses = [];
      if (cleanEmail) orClauses.push({ userEmail: cleanEmail });
      if (orderId) orClauses.push({ id: Number(orderId) });
      if (orClauses.length > 0) {
        isDelivered = await Order.findOne({ ...matchCriteria, $or: orClauses });
      }
    }

    if (!isDelivered) {
      return res.status(403).json({ success: false, message: "Review blocked: Only customers whose order has been Delivered can write a review for this dish." });
    }

    const newReview = await Review.create({
      recipeId,
      userName: userName.trim(),
      userEmail: cleanEmail,
      rating: numRating,
      comment: comment.trim(),
    });

    const allReviews = await Review.find({ recipeId });
    const { count, avg } = calcRating(allReviews);
    await Recipe.findOneAndUpdate({ id: recipeId }, { rating: avg, reviewCount: count });

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

module.exports = { getReviewsForRecipe, checkReviewEligibility, addReviewForRecipe };

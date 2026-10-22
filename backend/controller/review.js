const Review = require("../models/review");
const Recipe = require("../models/recipe");
const Order = require("../models/order");

// Get all reviews for a specific dish ID
const getReviewsForRecipe = async (req, res) => {
  try {
    const recipeId = Number(req.params.id);
    if (isNaN(recipeId)) {
      return res.status(400).json({ success: false, message: "Invalid dish ID" });
    }

    const reviews = await Review.find({ recipeId }).sort({ createdAt: -1 });
    const count = reviews.length;
    const averageRating = count > 0
      ? Number((reviews.reduce((sum, r) => sum + r.rating, 0) / count).toFixed(1))
      : null;

    return res.status(200).json({
      success: true,
      count,
      averageRating,
      reviews,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch reviews",
      error: error.message,
    });
  }
};

// Check if user has an order containing this dish that has been DELIVERED
const checkReviewEligibility = async (req, res) => {
  try {
    const recipeId = Number(req.params.id);
    const { email } = req.query;

    if (isNaN(recipeId)) {
      return res.status(400).json({ success: false, message: "Invalid dish ID" });
    }

    if (!email || !email.trim()) {
      return res.status(200).json({
        success: true,
        eligible: false,
        reason: "not_logged_in",
        message: "Log in with your registered email to check review eligibility.",
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Admin can always review
    if (cleanEmail === "admin@foodninja.com") {
      return res.status(200).json({
        success: true,
        eligible: true,
        orderId: 999999,
        message: "Store Administrator: Review authorization granted.",
      });
    }

    // Check if user has already reviewed this dish
    const existingReview = await Review.findOne({
      recipeId,
      userEmail: cleanEmail,
    });

    // Check MongoDB for a Delivered order containing this dish
    const deliveredOrder = await Order.findOne({
      userEmail: cleanEmail,
      status: "Delivered",
      items: { $elemMatch: { id: recipeId } },
    });

    if (deliveredOrder) {
      return res.status(200).json({
        success: true,
        eligible: true,
        alreadyReviewed: !!existingReview,
        orderId: deliveredOrder.id,
        message: existingReview
          ? "You have already reviewed this delivered dish."
          : "Verified Buyer: Order delivered! You are verified to write a review.",
      });
    }

    // Check if user has ordered it, but it's still being prepared or out for delivery
    const pendingOrder = await Order.findOne({
      userEmail: cleanEmail,
      status: { $in: ["Placed", "Preparing", "Out for Delivery"] },
      items: { $elemMatch: { id: recipeId } },
    });

    if (pendingOrder) {
      return res.status(200).json({
        success: true,
        eligible: false,
        reason: "order_pending",
        message: `Your order #${pendingOrder.id} is currently ${pendingOrder.status}. Review will unlock once your order is Delivered!`,
      });
    }

    // Has not ordered this dish
    return res.status(200).json({
      success: true,
      eligible: false,
      reason: "not_ordered",
      message: "Only verified customers who have ordered and received this dish can write a review.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to check review eligibility",
      error: error.message,
    });
  }
};

// Add a review for a specific dish ID (Delivered Order verification required)
const addReviewForRecipe = async (req, res) => {
  try {
    const recipeId = Number(req.params.id);
    if (isNaN(recipeId)) {
      return res.status(400).json({ success: false, message: "Invalid dish ID" });
    }

    const { userName, userEmail, rating, comment, orderId } = req.body;

    if (!userName || !userName.trim()) {
      return res.status(400).json({ success: false, message: "Your name is required." });
    }

    if (!comment || !comment.trim()) {
      return res.status(400).json({ success: false, message: "Review comment is required." });
    }

    const numericRating = Number(rating);
    if (!numericRating || numericRating < 1 || numericRating > 5) {
      return res.status(400).json({ success: false, message: "Rating must be between 1 and 5 stars." });
    }

    const cleanEmail = (userEmail || "").trim().toLowerCase();

    // Strict Delivered Order Verification
    let isDelivered = null;

    if (cleanEmail === "admin@foodninja.com") {
      isDelivered = true;
    } else {
      if (cleanEmail) {
        isDelivered = await Order.findOne({
          userEmail: cleanEmail,
          status: "Delivered",
          items: { $elemMatch: { id: recipeId } },
        });
      }

      if (!isDelivered && orderId) {
        isDelivered = await Order.findOne({
          id: Number(orderId),
          status: "Delivered",
          items: { $elemMatch: { id: recipeId } },
        });
      }
    }

    if (!isDelivered) {
      return res.status(403).json({
        success: false,
        message: "Review blocked: Only customers whose order has been Delivered can write a review for this dish.",
      });
    }

    // Create the review
    const newReview = await Review.create({
      recipeId,
      userName: userName.trim(),
      userEmail: cleanEmail,
      rating: numericRating,
      comment: comment.trim(),
    });

    // Update parent Recipe rating and reviewCount in database
    const allReviews = await Review.find({ recipeId });
    const count = allReviews.length;
    const avgRating = Number((allReviews.reduce((sum, r) => sum + r.rating, 0) / count).toFixed(1));

    await Recipe.findOneAndUpdate(
      { id: recipeId },
      { rating: avgRating, reviewCount: count }
    );

    return res.status(201).json({
      success: true,
      message: "Review submitted successfully!",
      review: newReview,
      averageRating: avgRating,
      totalReviews: count,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to submit review",
      error: error.message,
    });
  }
};

module.exports = {
  getReviewsForRecipe,
  checkReviewEligibility,
  addReviewForRecipe,
};

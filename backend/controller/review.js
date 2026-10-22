const Review = require("../models/review");
const Recipe = require("../models/recipe");

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

// Add a review for a specific dish ID
const addReviewForRecipe = async (req, res) => {
  try {
    const recipeId = Number(req.params.id);
    if (isNaN(recipeId)) {
      return res.status(400).json({ success: false, message: "Invalid dish ID" });
    }

    const { userName, userEmail, rating, comment } = req.body;

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

    // Create the review
    const newReview = await Review.create({
      recipeId,
      userName: userName.trim(),
      userEmail: (userEmail || "").trim().toLowerCase(),
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
  addReviewForRecipe,
};

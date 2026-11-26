const express = require("express");
const router = express.Router();
const { getRecipes, getRecipe, addRecipe, updateRecipe, updateRecipeStock, deleteRecipe } = require("../controllers/recipeController");
const { getReviewsForRecipe, checkReviewEligibility, addReviewForRecipe } = require("../controllers/reviewController");
const { requireAuth, optionalAuth, requireAdmin } = require("../middleware/authMiddleware");

router.route("/").get(getRecipes).post(requireAuth, requireAdmin, addRecipe);
router.route("/:id")
  .get(getRecipe)
  .put(requireAuth, requireAdmin, updateRecipe)
  .delete(requireAuth, requireAdmin, deleteRecipe);
router.route("/:id/stock").patch(requireAuth, requireAdmin, updateRecipeStock).put(requireAuth, requireAdmin, updateRecipeStock);
router.route("/:id/reviews").get(getReviewsForRecipe).post(requireAuth, addReviewForRecipe);
router.route("/:id/review-eligibility").get(optionalAuth, checkReviewEligibility);

module.exports = router;

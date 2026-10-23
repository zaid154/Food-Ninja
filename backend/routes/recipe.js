const express = require("express");
const router = express.Router();
const { getRecipes, getRecipe, addRecipe, updateRecipe, updateRecipeStock, deleteRecipe } = require("../controller/recipe");
const { getReviewsForRecipe, checkReviewEligibility, addReviewForRecipe } = require("../controller/review");

router.route("/").get(getRecipes).post(addRecipe);
router.route("/:id").get(getRecipe).put(updateRecipe).delete(deleteRecipe);
router.route("/:id/stock").patch(updateRecipeStock).put(updateRecipeStock);
router.route("/:id/reviews").get(getReviewsForRecipe).post(addReviewForRecipe);
router.route("/:id/review-eligibility").get(checkReviewEligibility);

module.exports = router;

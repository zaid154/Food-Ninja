const express = require("express");
const router = express.Router();
const { getRecipes, getRecipe, addRecipe, updateRecipe, deleteRecipe } = require("../controller/recipe");
const { getReviewsForRecipe, addReviewForRecipe } = require("../controller/review");

router.route("/").get(getRecipes).post(addRecipe);
router.route("/:id").get(getRecipe).put(updateRecipe).delete(deleteRecipe);
router.route("/:id/reviews").get(getReviewsForRecipe).post(addReviewForRecipe);

module.exports = router;

const express = require("express");
const router = express.Router();
const { getReviewsForRecipe, addReviewForRecipe } = require("../controller/review");

router.route("/:id").get(getReviewsForRecipe).post(addReviewForRecipe);

module.exports = router;

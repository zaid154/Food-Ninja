const express = require("express");
const router = express.Router();
const { getReviewsForRecipe, checkReviewEligibility, addReviewForRecipe } = require("../controllers/reviewController");

router.route("/:id").get(getReviewsForRecipe).post(addReviewForRecipe);
router.route("/:id/eligibility").get(checkReviewEligibility);

module.exports = router;

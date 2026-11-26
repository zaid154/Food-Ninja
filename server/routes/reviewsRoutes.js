const express = require("express");
const router = express.Router();
const { getReviewsForRecipe, checkReviewEligibility, addReviewForRecipe } = require("../controllers/reviewController");
const { requireAuth, optionalAuth } = require("../middleware/authMiddleware");

router.route("/:id").get(getReviewsForRecipe).post(requireAuth, addReviewForRecipe);
router.route("/:id/eligibility").get(optionalAuth, checkReviewEligibility);

module.exports = router;

const express = require("express");
const router = express.Router();
const { getPaymentKey, createPaymentOrder, verifyPaymentSignature } = require("../controllers/paymentController");
const { requireAuth } = require("../middleware/authMiddleware");
const { checkoutLimiter } = require("../middleware/securityMiddleware");

router.get("/key", getPaymentKey);
router.post("/create-order", checkoutLimiter, requireAuth, createPaymentOrder);
router.post("/verify", checkoutLimiter, requireAuth, verifyPaymentSignature);

module.exports = router;

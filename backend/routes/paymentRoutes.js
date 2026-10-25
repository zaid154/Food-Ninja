const express = require("express");
const router = express.Router();
const { getPaymentKey, createPaymentOrder, verifyPaymentSignature } = require("../controllers/paymentController");

router.get("/key", getPaymentKey);
router.post("/create-order", createPaymentOrder);
router.post("/verify", verifyPaymentSignature);

module.exports = router;

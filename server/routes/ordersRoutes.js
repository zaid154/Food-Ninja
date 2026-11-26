const express = require("express");
const router = express.Router();
const { getOrders, getOrderById, createOrder, updateOrderStatus } = require("../controllers/orderController");
const { requireAuth } = require("../middleware/authMiddleware");
const { checkoutLimiter } = require("../middleware/securityMiddleware");

router.route("/").get(requireAuth, getOrders).post(checkoutLimiter, requireAuth, createOrder);
router.route("/:id").get(requireAuth, getOrderById);
router.route("/:id/status").put(requireAuth, updateOrderStatus);

module.exports = router;

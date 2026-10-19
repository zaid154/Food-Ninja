const express = require("express");
const router = express.Router();
const { getOrders, getOrderById, createOrder, updateOrderStatus } = require("../controller/order");

router.route("/").get(getOrders).post(createOrder);
router.route("/:id").get(getOrderById);
router.route("/:id/status").put(updateOrderStatus);

module.exports = router;

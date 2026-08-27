const express = require("express");
const router = express.Router();
const { getOrders, createOrder, updateOrderStatus } = require("../controller/order");

router.route("/").get(getOrders).post(createOrder);
router.route("/:id/status").put(updateOrderStatus);

module.exports = router;

const Order = require("../models/orderModel");
const User = require("../models/userModel");
const Settings = require("../models/settingsModel");
const { getStoreStatus } = require("./settingsController");

const getOrders = async (req, res) => {
  try {
    const { email } = req.query;
    const query = email && email !== "all" ? { userEmail: email } : {};
    const orders = await Order.find(query).sort({ createdAt: -1 });
    return res.status(200).json({ orders });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch orders", error: error.message });
  }
};

const getOrderById = async (req, res) => {
  try {
    const rawId = req.params.id;
    const query = isNaN(Number(rawId)) ? { _id: rawId } : { id: Number(rawId) };
    const order = await Order.findOne(query);
    if (!order) return res.status(404).json({ message: "Order not found." });
    return res.status(200).json({ order });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch order", error: error.message });
  }
};

const createOrder = async (req, res) => {
  try {
    const { customerName, phone, address, items, total, userEmail, payment, paymentStatus, paymentMethod } = req.body;
    if (!customerName || !phone || !address || !items || !total) {
      return res.status(400).json({ message: "Missing required order details." });
    }

    const email = typeof userEmail === "string" ? userEmail.trim().toLowerCase() : "";
    if (email && email !== "guest") {
      const customer = await User.findOne({ email }).select("isBlocked");
      if (customer?.isBlocked) {
        return res.status(403).json({ message: "This account is blocked and cannot place orders. Please contact the restaurant for help." });
      }
    }

    const settings = (await Settings.findOne({ key: "store_settings" })) || new Settings();
    const storeStatus = getStoreStatus(settings);
    if (!storeStatus.isEffectiveOpen) {
      return res.status(403).json({ message: storeStatus.effectiveClosedReason });
    }

    const payMode = payment || "Cash on Delivery";
    const newOrder = new Order({
      id: req.body.id || Date.now(),
      userEmail: email || "guest",
      customerName, phone, address, items, total,
      payment: payMode,
      paymentStatus: paymentStatus || (payMode === "Online Payment" ? "Paid" : "Pending"),
      paymentMethod: paymentMethod || (payMode === "Cash on Delivery" ? "Cash on Delivery" : ""),
      razorpayOrderId: req.body.razorpayOrderId || "",
      razorpayPaymentId: req.body.razorpayPaymentId || "",
      razorpaySignature: req.body.razorpaySignature || "",
      subtotal: req.body.subtotal || 0,
      deliveryFee: req.body.deliveryFee !== undefined ? req.body.deliveryFee : 30,
      packagingFee: req.body.packagingFee !== undefined ? req.body.packagingFee : 0,
      taxes: req.body.taxes || 0,
      discount: req.body.discount !== undefined ? req.body.discount : 0,
      estDelivery: req.body.estDelivery || "30–40 mins",
      status: "Placed",
      date: req.body.date || new Date().toLocaleString(),
    });

    await newOrder.save();
    return res.status(201).json({ message: "Order placed successfully!", order: newOrder });
  } catch (error) {
    return res.status(500).json({ message: "Failed to create order", error: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findOneAndUpdate({ id: Number(req.params.id) }, { status: req.body.status }, { new: true });
    if (!order) return res.status(404).json({ message: "Order not found." });
    return res.status(200).json({ message: "Order status updated!", order });
  } catch (error) {
    return res.status(500).json({ message: "Failed to update order status", error: error.message });
  }
};

module.exports = { getOrders, getOrderById, createOrder, updateOrderStatus };

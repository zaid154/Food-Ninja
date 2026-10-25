const Order = require("../models/orderModel");
const User = require("../models/userModel");
const Settings = require("../models/settingsModel");
const { getStoreStatus } = require("./settingsController");

// Get all orders (for Admin or user)
const getOrders = async (req, res) => {
  try {
    const { email } = req.query;
    let query = {};
    if (email && email !== "all") {
      query.userEmail = email;
    }
    const orders = await Order.find(query).sort({ createdAt: -1 });
    return res.status(200).json({ orders });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch orders", error: error.message });
  }
};

// Get single order by ID
const getOrderById = async (req, res) => {
  try {
    const rawId = req.params.id;
    let query = { id: Number(rawId) };
    if (isNaN(query.id)) {
      query = { _id: rawId };
    }
    const order = await Order.findOne(query);
    if (!order) return res.status(404).json({ message: "Order not found." });
    return res.status(200).json({ order });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch order", error: error.message });
  }
};

// Create new customer order
const createOrder = async (req, res) => {
  try {
    const {
      id,
      userEmail,
      customerName,
      phone,
      address,
      payment,
      paymentStatus,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      items,
      subtotal,
      deliveryFee,
      packagingFee,
      taxes,
      discount,
      paymentMethod,
      total,
      estDelivery,
      date,
    } = req.body;

    if (!customerName || !phone || !address || !items || !total) {
      return res.status(400).json({ message: "Missing required order details." });
    }

    const normalizedUserEmail = typeof userEmail === "string" ? userEmail.trim().toLowerCase() : "";
    if (normalizedUserEmail && normalizedUserEmail !== "guest") {
      const customer = await User.findOne({ email: normalizedUserEmail }).select("isBlocked");
      if (customer?.isBlocked) {
        return res.status(403).json({ message: "This account is blocked and cannot place orders. Please contact the restaurant for help." });
      }
    }

    const settings = (await Settings.findOne({ key: "store_settings" })) || new Settings();
    const storeStatus = getStoreStatus(settings);
    if (!storeStatus.isEffectiveOpen) {
      return res.status(403).json({ message: storeStatus.effectiveClosedReason });
    }

    const orderId = id || Date.now();
    const newOrder = new Order({
      id: orderId,
      userEmail: normalizedUserEmail || "guest",
      customerName,
      phone,
      address,
      payment: payment || "Cash on Delivery",
      paymentStatus: paymentStatus || (payment === "Online Payment" ? "Paid" : "Pending"),
      paymentMethod: paymentMethod || (payment === "Cash on Delivery" ? "Cash on Delivery" : ""),
      razorpayOrderId: razorpayOrderId || "",
      razorpayPaymentId: razorpayPaymentId || "",
      razorpaySignature: razorpaySignature || "",
      items,
      subtotal: subtotal || 0,
      deliveryFee: deliveryFee !== undefined ? deliveryFee : 30,
      packagingFee: packagingFee !== undefined ? packagingFee : 0,
      taxes: taxes || 0,
      discount: discount !== undefined ? discount : 0,
      total,
      estDelivery: estDelivery || "30–40 mins",
      status: "Placed",
      date: date || new Date().toLocaleString(),
    });

    await newOrder.save();
    return res.status(201).json({ message: "Order placed successfully!", order: newOrder });
  } catch (error) {
    return res.status(500).json({ message: "Failed to create order", error: error.message });
  }
};

// Admin: Update order status
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findOneAndUpdate(
      { id: Number(req.params.id) },
      { status },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: "Order not found." });
    return res.status(200).json({ message: "Order status updated!", order });
  } catch (error) {
    return res.status(500).json({ message: "Failed to update order status", error: error.message });
  }
};

module.exports = { getOrders, getOrderById, createOrder, updateOrderStatus };

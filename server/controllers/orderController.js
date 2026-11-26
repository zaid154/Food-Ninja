const mongoose = require("mongoose");
const Order = require("../models/orderModel");
const Settings = require("../models/settingsModel");
const { getStoreStatus } = require("./settingsController");
const { resolveItemPricing } = require("../utils/calculateServerOrderTotal");
const {
  isRazorpayConfigured,
  isDemoPaymentAllowed,
  verifyRazorpayTransaction,
} = require("./paymentController");

const ALLOWED_ORDER_STATUSES = ["Placed", "Preparing", "Out for Delivery", "Delivered", "Cancelled"];

const resolveOrderQuery = (rawId) => {
  if (typeof rawId !== "string" && typeof rawId !== "number") return null;
  const trimmed = String(rawId).trim();
  if (/^\d+$/.test(trimmed)) return { id: Number(trimmed) };
  if (mongoose.isValidObjectId(trimmed)) return { _id: trimmed };
  return null;
};

const isOrderOwner = (order, user) => {
  if (!order || !user) return false;
  if (order.userId && String(order.userId) === String(user._id)) return true;
  if (order.userEmail && user.email && order.userEmail.toLowerCase() === user.email.toLowerCase()) return true;
  return false;
};

const getOrders = async (req, res) => {
  try {
    if (req.user.role === "admin") {
      const emailFilter = typeof req.query.email === "string" ? req.query.email.trim().toLowerCase() : "";
      const query = emailFilter && emailFilter !== "all" ? { userEmail: emailFilter } : {};
      const orders = await Order.find(query).sort({ createdAt: -1 });
      return res.status(200).json({ orders });
    }

    const orders = await Order.find({
      $or: [{ userId: req.user._id }, { userEmail: req.user.email }],
    }).sort({ createdAt: -1 });

    return res.status(200).json({ orders });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch orders", error: error.message });
  }
};

const getOrderById = async (req, res) => {
  try {
    const query = resolveOrderQuery(req.params.id);
    if (!query) return res.status(404).json({ message: "Order not found." });

    const order = await Order.findOne(query);
    if (!order) return res.status(404).json({ message: "Order not found." });

    if (req.user.role !== "admin" && !isOrderOwner(order, req.user)) {
      return res.status(403).json({ message: "Forbidden: You can only view your own orders." });
    }

    return res.status(200).json({ order });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch order", error: error.message });
  }
};

const createOrder = async (req, res) => {
  try {
    if (req.user.isBlocked) {
      return res.status(403).json({
        message: "This account is blocked and cannot place orders. Please contact the restaurant for help.",
      });
    }

    const { customerName, phone, address, items, payment } = req.body || {};

    if (typeof customerName !== "string" || customerName.trim().length < 2 || customerName.trim().length > 100) {
      return res.status(400).json({ message: "Please provide a valid customer name (2–100 characters)." });
    }
    const cleanPhone = typeof phone === "string" ? phone.replace(/\D/g, "") : "";
    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      return res.status(400).json({ message: "Please provide a valid 10-digit Indian mobile number." });
    }
    if (typeof address !== "string" || address.trim().length < 5 || address.trim().length > 400) {
      return res.status(400).json({ message: "Please provide a complete delivery address." });
    }

    const payMode = typeof payment === "string" ? payment.trim() : "Cash on Delivery";
    if (!["Cash on Delivery", "Online Payment"].includes(payMode)) {
      return res.status(400).json({ message: "Invalid payment method." });
    }

    const settings = (await Settings.findOne({ key: "store_settings" })) || new Settings();
    const storeStatus = getStoreStatus(settings);
    if (!storeStatus.isEffectiveOpen) {
      return res.status(403).json({ message: storeStatus.effectiveClosedReason });
    }

    // Authoritative server-side dish lookup & fee calculation
    const pricing = await resolveItemPricing(items);
    if (pricing.errorMessage) {
      return res.status(pricing.errorStatus || 400).json({ message: pricing.errorMessage });
    }

    let serverPaymentStatus = "Pending";
    let serverPaymentMethod = "Cash on Delivery";
    let verifiedRzOrderId = "";
    let verifiedRzPaymentId;

    if (payMode === "Online Payment") {
      const rawOrderId = typeof req.body.razorpayOrderId === "string" ? req.body.razorpayOrderId.trim() : "";
      const rawPaymentId = typeof req.body.razorpayPaymentId === "string" ? req.body.razorpayPaymentId.trim() : "";
      const rawSignature = typeof req.body.razorpaySignature === "string" ? req.body.razorpaySignature.trim() : "";

      if (isRazorpayConfigured()) {
        const expectedPaise = Math.round(pricing.total * 100);
        const check = await verifyRazorpayTransaction({
          razorpayOrderId: rawOrderId,
          razorpayPaymentId: rawPaymentId,
          razorpaySignature: rawSignature,
          expectedAmountInPaise: expectedPaise,
        });
        if (!check.ok) {
          return res.status(check.status).json({ message: check.message });
        }

        const existingPayment = await Order.findOne({ razorpayPaymentId: rawPaymentId }).select("_id").lean();
        if (existingPayment) {
          return res.status(409).json({ message: "This payment reference has already been redeemed for an order." });
        }

        serverPaymentStatus = "Paid";
        serverPaymentMethod = check.method || "Online Payment";
        verifiedRzOrderId = rawOrderId;
        verifiedRzPaymentId = rawPaymentId;
      } else if (isDemoPaymentAllowed() && rawOrderId.startsWith("order_demo_") && rawPaymentId.startsWith("pay_demo_")) {
        serverPaymentStatus = "Paid";
        serverPaymentMethod = "Demo/Test";
        verifiedRzOrderId = rawOrderId;
        verifiedRzPaymentId = rawPaymentId;
      } else {
        return res.status(400).json({ message: "Valid verified online payment credentials are required." });
      }
    }

    const totalItems = pricing.itemCount;
    const estDelivery = totalItems > 4 ? "40–50 mins" : "25–30 mins";
    const generatedId = Date.now() * 100 + Math.floor(Math.random() * 100);

    const newOrder = new Order({
      id: generatedId,
      userId: req.user._id,
      userEmail: req.user.email,
      customerName: customerName.trim(),
      phone: cleanPhone,
      address: address.trim(),
      items: pricing.items,
      subtotal: pricing.subtotal,
      deliveryFee: pricing.deliveryFee,
      packagingFee: pricing.packagingFee,
      taxes: pricing.taxes,
      discount: pricing.discount,
      total: pricing.total,
      payment: payMode,
      paymentStatus: serverPaymentStatus,
      paymentMethod: serverPaymentMethod,
      razorpayOrderId: verifiedRzOrderId,
      ...(verifiedRzPaymentId ? { razorpayPaymentId: verifiedRzPaymentId } : {}),
      razorpaySignature: "", // Never persist raw cryptographic signatures long-term
      estDelivery,
      status: "Placed",
      date: new Date().toLocaleString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }),
    });

    await newOrder.save();
    return res.status(201).json({ message: "Order placed successfully!", order: newOrder });
  } catch (error) {
    if (error && error.code === 11000) {
      return res.status(409).json({ message: "Duplicate order or payment ID detected." });
    }
    return res.status(500).json({ message: "Failed to create order", error: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const query = resolveOrderQuery(req.params.id);
    if (!query) return res.status(404).json({ message: "Order not found." });

    const { status } = req.body || {};
    if (typeof status !== "string" || !ALLOWED_ORDER_STATUSES.includes(status)) {
      return res.status(400).json({ message: `Invalid status. Must be one of: ${ALLOWED_ORDER_STATUSES.join(", ")}` });
    }

    const existingOrder = await Order.findOne(query);
    if (!existingOrder) return res.status(404).json({ message: "Order not found." });

    if (req.user.role === "admin") {
      const updated = await Order.findOneAndUpdate(query, { status }, { new: true, runValidators: true });
      return res.status(200).json({ message: "Order status updated!", order: updated });
    }

    if (!isOrderOwner(existingOrder, req.user)) {
      return res.status(403).json({ message: "Forbidden: You cannot modify another user's order." });
    }

    if (status !== "Cancelled") {
      return res.status(403).json({ message: "Forbidden: Only restaurant administrators can advance order fulfillment states." });
    }

    if (existingOrder.status !== "Placed") {
      return res.status(400).json({ message: `Cannot cancel order once kitchen has marked it ${existingOrder.status}.` });
    }

    const cancelled = await Order.findOneAndUpdate(
      { ...query, status: "Placed" },
      { status: "Cancelled" },
      { new: true, runValidators: true }
    );
    if (!cancelled) {
      return res.status(409).json({ message: "Order status changed before cancellation could complete." });
    }

    return res.status(200).json({ message: "Order cancelled successfully.", order: cancelled });
  } catch (error) {
    return res.status(500).json({ message: "Failed to update order status", error: error.message });
  }
};

module.exports = { getOrders, getOrderById, createOrder, updateOrderStatus };

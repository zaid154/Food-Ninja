const Razorpay = require("razorpay");
const crypto = require("crypto");
const Settings = require("../models/settingsModel");
const { getStoreStatus } = require("./settingsController");
const { resolveItemPricing } = require("../utils/calculateServerOrderTotal");

const getKeyId = () => process.env.RAZORPAY_KEY_ID || "";
const getKeySecret = () => process.env.RAZORPAY_KEY_SECRET || "";

const isRazorpayConfigured = () => {
  const id = getKeyId();
  const sec = getKeySecret();
  return Boolean(id && sec && !id.includes("placeholder") && !id.includes("YOUR_"));
};

const isDemoPaymentAllowed = () => !isRazorpayConfigured() && process.env.NODE_ENV !== "production";

const timingSafeHexEqual = (expectedHex, providedHex) => {
  if (typeof expectedHex !== "string" || typeof providedHex !== "string") return false;
  if (!/^[a-f0-9]+$/i.test(providedHex) || expectedHex.length !== providedHex.length) return false;
  try {
    return crypto.timingSafeEqual(Buffer.from(expectedHex, "hex"), Buffer.from(providedHex, "hex"));
  } catch {
    return false;
  }
};

const verifyRazorpayTransaction = async ({
  razorpayOrderId,
  razorpayPaymentId,
  razorpaySignature,
  expectedAmountInPaise = null,
}) => {
  if (
    typeof razorpayOrderId !== "string" ||
    typeof razorpayPaymentId !== "string" ||
    typeof razorpaySignature !== "string" ||
    !razorpayOrderId.trim() ||
    !razorpayPaymentId.trim() ||
    !razorpaySignature.trim()
  ) {
    return { ok: false, status: 400, message: "Missing required Razorpay payment verification fields." };
  }

  const signPayload = `${razorpayOrderId.trim()}|${razorpayPaymentId.trim()}`;
  const expectedSignature = crypto.createHmac("sha256", getKeySecret()).update(signPayload).digest("hex");

  if (!timingSafeHexEqual(expectedSignature, razorpaySignature.trim())) {
    return { ok: false, status: 400, message: "Invalid payment signature verification failed." };
  }

  try {
    const razorpay = new Razorpay({ key_id: getKeyId(), key_secret: getKeySecret() });
    const payment = await razorpay.payments.fetch(razorpayPaymentId.trim());
    if (!payment || payment.order_id !== razorpayOrderId.trim()) {
      return { ok: false, status: 400, message: "Payment does not belong to the supplied order." };
    }
    if (payment.currency !== "INR") {
      return { ok: false, status: 400, message: "Invalid payment currency." };
    }
    if (!["captured", "authorized"].includes(payment.status)) {
      return { ok: false, status: 400, message: `Payment is not completed (status: ${payment.status || "unknown"}).` };
    }
    if (expectedAmountInPaise !== null && Number(payment.amount) !== Number(expectedAmountInPaise)) {
      return { ok: false, status: 400, message: "Paid amount does not match the server-calculated order total." };
    }
    return { ok: true, method: payment.method || "", payment };
  } catch (err) {
    return { ok: false, status: 502, message: "Unable to confirm payment status with payment gateway." };
  }
};

const getPaymentKey = (_req, res) => {
  const configured = isRazorpayConfigured();
  res.json({
    success: true,
    keyId: configured ? getKeyId() : (isDemoPaymentAllowed() ? "rzp_test_placeholder" : ""),
    configured,
  });
};

const createPaymentOrder = async (req, res) => {
  try {
    if (req.user?.isBlocked) {
      return res.status(403).json({
        success: false,
        message: "This account is blocked and cannot place orders. Please contact the restaurant for help.",
      });
    }

    const { items, currency = "INR" } = req.body || {};
    if (currency !== "INR") {
      return res.status(400).json({ success: false, message: "Only INR currency is supported." });
    }

    const settings = (await Settings.findOne({ key: "store_settings" })) || new Settings();
    const storeStatus = getStoreStatus(settings);
    if (!storeStatus.isEffectiveOpen) {
      return res.status(403).json({ success: false, message: storeStatus.effectiveClosedReason });
    }

    const pricing = await resolveItemPricing(items);
    if (pricing.errorMessage) {
      return res.status(pricing.errorStatus || 400).json({ success: false, message: pricing.errorMessage });
    }

    const amountInPaise = Math.round(pricing.total * 100);

    if (isRazorpayConfigured()) {
      const razorpay = new Razorpay({ key_id: getKeyId(), key_secret: getKeySecret() });
      const order = await razorpay.orders.create({
        amount: amountInPaise,
        currency: "INR",
        receipt: `rcpt_${Date.now()}`,
        notes: { app: "Food Ninja", userId: String(req.user._id) },
      });
      return res.status(200).json({
        success: true,
        order,
        key: getKeyId(),
        isDemo: false,
        calculatedTotal: pricing.total,
      });
    }

    if (!isDemoPaymentAllowed()) {
      return res.status(503).json({
        success: false,
        message: "Online payment gateway is not configured on the server.",
      });
    }

    const demoOrder = {
      id: `order_demo_${Date.now()}`,
      entity: "order",
      amount: amountInPaise,
      amount_paid: 0,
      amount_due: amountInPaise,
      currency: "INR",
      receipt: `rcpt_demo_${Date.now()}`,
      status: "created",
      created_at: Math.floor(Date.now() / 1000),
    };

    return res.status(200).json({
      success: true,
      order: demoOrder,
      key: "rzp_test_placeholder",
      isDemo: true,
      calculatedTotal: pricing.total,
      message: "Running in local development demo mode without Razorpay keys.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.description || error.message || "Failed to create Razorpay order",
    });
  }
};

const verifyPaymentSignature = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, isDemo, items } = req.body || {};

    if (!isRazorpayConfigured()) {
      if (isDemoPaymentAllowed() && isDemo === true) {
        return res.status(200).json({
          success: true,
          verified: true,
          isDemo: true,
          paymentId: typeof razorpay_payment_id === "string" && razorpay_payment_id ? razorpay_payment_id : `pay_demo_${Date.now()}`,
          method: "Demo/Test",
          message: "Demo payment verified successfully",
        });
      }
      return res.status(503).json({
        success: false,
        verified: false,
        message: "Online payment gateway is not configured on the server.",
      });
    }

    let expectedAmountInPaise = null;
    if (Array.isArray(items) && items.length > 0) {
      const pricing = await resolveItemPricing(items);
      if (pricing.errorMessage) {
        return res.status(pricing.errorStatus || 400).json({ success: false, verified: false, message: pricing.errorMessage });
      }
      expectedAmountInPaise = Math.round(pricing.total * 100);
    }

    const check = await verifyRazorpayTransaction({
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
      expectedAmountInPaise,
    });

    if (!check.ok) {
      return res.status(check.status).json({ success: false, verified: false, message: check.message });
    }

    return res.status(200).json({
      success: true,
      verified: true,
      paymentId: razorpay_payment_id,
      method: check.method,
      message: "Payment verified successfully",
    });
  } catch (error) {
    return res.status(500).json({ success: false, verified: false, message: error.message || "Payment verification failed" });
  }
};

module.exports = {
  getPaymentKey,
  createPaymentOrder,
  verifyPaymentSignature,
  isRazorpayConfigured,
  isDemoPaymentAllowed,
  verifyRazorpayTransaction,
};

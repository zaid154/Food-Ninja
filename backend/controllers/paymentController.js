const Razorpay = require("razorpay");
const crypto = require("crypto");
const User = require("../models/userModel");

const getKeyId = () => process.env.RAZORPAY_KEY_ID || "";
const getKeySecret = () => process.env.RAZORPAY_KEY_SECRET || "";
const isRazorpayConfigured = () => {
  const id = getKeyId(), sec = getKeySecret();
  return Boolean(id && sec && !id.includes("placeholder") && !id.includes("YOUR_"));
};

const getPaymentKey = (req, res) => {
  res.json({ success: true, keyId: getKeyId() || "rzp_test_placeholder", configured: isRazorpayConfigured() });
};

const createPaymentOrder = async (req, res) => {
  try {
    const { amount, currency = "INR", notes = {}, userEmail = "" } = req.body;
    if (!amount || amount <= 0) return res.status(400).json({ success: false, message: "Invalid order amount" });

    const normalizedEmail = typeof userEmail === "string" ? userEmail.trim().toLowerCase() : "";
    if (normalizedEmail) {
      const customer = await User.findOne({ email: normalizedEmail }).select("isBlocked");
      if (customer?.isBlocked) {
        return res.status(403).json({ success: false, message: "This account is blocked and cannot place orders. Please contact the restaurant for help." });
      }
    }

    const amountInPaise = Math.round(Number(amount) * 100);
    if (isRazorpayConfigured()) {
      const razorpay = new Razorpay({ key_id: getKeyId(), key_secret: getKeySecret() });
      const order = await razorpay.orders.create({ amount: amountInPaise, currency, receipt: `rcpt_${Date.now()}`, notes: { app: "Food Ninja", ...notes } });
      return res.status(200).json({ success: true, order, key: getKeyId(), isDemo: false });
    }

    const demoOrder = {
      id: `order_demo_${Date.now()}`, entity: "order", amount: amountInPaise, amount_paid: 0,
      amount_due: amountInPaise, currency, receipt: `rcpt_demo_${Date.now()}`, status: "created", created_at: Math.floor(Date.now() / 1000)
    };
    return res.status(200).json({
      success: true, order: demoOrder, key: getKeyId() || "rzp_test_placeholder", isDemo: true,
      message: "Running in test/demo mode. Add live/test keys in backend/.env for production Razorpay checkout."
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.description || error.message || "Failed to create Razorpay order" });
  }
};

const verifyPaymentSignature = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, isDemo } = req.body;
    if (isDemo || !isRazorpayConfigured()) {
      return res.status(200).json({
        success: true, verified: true, isDemo: true, paymentId: razorpay_payment_id || `pay_demo_${Date.now()}`,
        method: "Demo/Test", message: "Demo payment verified successfully"
      });
    }

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ success: false, message: "Missing signature fields" });
    }

    const signPayload = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto.createHmac("sha256", getKeySecret()).update(signPayload.toString()).digest("hex");

    if (expectedSignature === razorpay_signature) {
      let method = "";
      try {
        const razorpay = new Razorpay({ key_id: getKeyId(), key_secret: getKeySecret() });
        const payment = await razorpay.payments.fetch(razorpay_payment_id);
        method = payment?.method || "";
      } catch {}

      return res.status(200).json({ success: true, verified: true, paymentId: razorpay_payment_id, method, message: "Payment verified successfully" });
    }
    return res.status(400).json({ success: false, verified: false, message: "Invalid payment signature verification failed" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || "Payment verification failed" });
  }
};

module.exports = { getPaymentKey, createPaymentOrder, verifyPaymentSignature };

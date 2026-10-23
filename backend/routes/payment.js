const express = require("express");
const router = express.Router();
const Razorpay = require("razorpay");
const crypto = require("crypto");

// Check if valid keys are provided
const getKeyId = () => process.env.RAZORPAY_KEY_ID || "";
const getKeySecret = () => process.env.RAZORPAY_KEY_SECRET || "";

const isRazorpayConfigured = () => {
  const id = getKeyId();
  const sec = getKeySecret();
  return Boolean(id && sec && !id.includes("placeholder") && !id.includes("YOUR_"));
};

// 1. Get Public Key for Frontend checkout
router.get("/key", (req, res) => {
  const configured = isRazorpayConfigured();
  return res.json({
    success: true,
    keyId: getKeyId() || "rzp_test_placeholder",
    configured,
  });
});

// 2. Create Razorpay Order
router.post("/create-order", async (req, res) => {
  try {
    const { amount, currency = "INR", notes = {} } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: "Invalid order amount" });
    }

    const amountInPaise = Math.round(Number(amount) * 100);

    // If real keys are configured, use official Razorpay SDK
    if (isRazorpayConfigured()) {
      const razorpay = new Razorpay({
        key_id: getKeyId(),
        key_secret: getKeySecret(),
      });

      const options = {
        amount: amountInPaise,
        currency,
        receipt: `rcpt_${Date.now()}`,
        notes: {
          app: "Food Ninja",
          ...notes,
        },
      };

      const order = await razorpay.orders.create(options);
      return res.status(200).json({
        success: true,
        order,
        key: getKeyId(),
        isDemo: false,
      });
    }

    // Demo / Simulated mode when keys are not configured yet
    const demoOrder = {
      id: `order_demo_${Date.now()}`,
      entity: "order",
      amount: amountInPaise,
      amount_paid: 0,
      amount_due: amountInPaise,
      currency,
      receipt: `rcpt_demo_${Date.now()}`,
      status: "created",
      created_at: Math.floor(Date.now() / 1000),
    };

    return res.status(200).json({
      success: true,
      order: demoOrder,
      key: getKeyId() || "rzp_test_placeholder",
      isDemo: true,
      message: "Running in test/demo mode. Add live/test keys in backend/.env for production Razorpay checkout.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.description || error.message || "Failed to create Razorpay order",
    });
  }
});

// 3. Verify Payment Signature
router.post("/verify", (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, isDemo } = req.body;

    if (isDemo || !isRazorpayConfigured()) {
      return res.status(200).json({
        success: true,
        verified: true,
        isDemo: true,
        paymentId: razorpay_payment_id || `pay_demo_${Date.now()}`,
        message: "Demo payment verified successfully",
      });
    }

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ success: false, message: "Missing signature fields" });
    }

    const signPayload = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac("sha256", getKeySecret())
      .update(signPayload.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      return res.status(200).json({
        success: true,
        verified: true,
        paymentId: razorpay_payment_id,
        message: "Payment verified successfully",
      });
    } else {
      return res.status(400).json({
        success: false,
        verified: false,
        message: "Invalid payment signature verification failed",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Payment verification failed",
    });
  }
});

module.exports = router;

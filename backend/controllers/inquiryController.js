const Inquiry = require("../models/inquiryModel");

const createInquiry = async (req, res) => {
  try {
    const { name, email, phone, subject, message, orderId, type, issueCategory, orderStatus, orderTotal, priority } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: "Please provide your name, email, and message." });
    }

    const newInquiry = await Inquiry.create({
      name, email, phone: phone || "",
      subject: subject || (orderId ? `Order #${orderId} Help` : "General Inquiry"),
      message,
      orderId: orderId ? String(orderId) : "",
      type: type || (orderId ? "order_issue" : "general"),
      issueCategory: issueCategory || "",
      orderStatus: orderStatus || "",
      orderTotal: orderTotal ? Number(orderTotal) : 0,
      priority: priority || (orderId ? "high" : "normal"),
      isResolved: false
    });

    return res.status(201).json({
      success: true,
      message: orderId ? `Support ticket for Order #${orderId} submitted. Our kitchen team has been alerted!` : "Thank you for reaching out! Your message has been received.",
      inquiry: newInquiry
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getInquiries = async (req, res) => {
  try {
    const inquiries = await Inquiry.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, inquiries });
  } catch (error) {
    return res.status(500).json({ success: false, inquiries: [], message: error.message });
  }
};

const deleteInquiry = async (req, res) => {
  try {
    const inquiry = await Inquiry.findByIdAndDelete(req.params.id);
    if (!inquiry) return res.status(404).json({ success: false, message: "Inquiry not found" });
    return res.status(200).json({ success: true, message: "Inquiry deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const replyInquiry = async (req, res) => {
  try {
    const { replyMessage } = req.body;
    if (!replyMessage?.trim()) return res.status(400).json({ success: false, message: "Reply message cannot be empty." });

    const updated = await Inquiry.findByIdAndUpdate(
      req.params.id,
      { status: "Replied", replyMessage: replyMessage.trim(), repliedAt: new Date() },
      { new: true }
    );
    if (!updated) return res.status(404).json({ success: false, message: "Inquiry not found." });
    return res.status(200).json({ success: true, message: "Reply recorded successfully", inquiry: updated });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const resolveInquiry = async (req, res) => {
  try {
    const existing = await Inquiry.findById(req.params.id);
    if (!existing) return res.status(404).json({ success: false, message: "Inquiry not found." });

    const nextState = req.body.isResolved !== undefined ? Boolean(req.body.isResolved) : !existing.isResolved;
    existing.isResolved = nextState;
    if (nextState && existing.status === "New") existing.status = "Replied";
    await existing.save();

    return res.status(200).json({
      success: true, message: `Inquiry marked as ${nextState ? "Resolved" : "Pending"}`, inquiry: existing
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { createInquiry, getInquiries, deleteInquiry, replyInquiry, resolveInquiry };

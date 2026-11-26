const mongoose = require("mongoose");
const Inquiry = require("../models/inquiryModel");

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const VALID_TYPES = new Set(["general", "order_issue"]);
const VALID_PRIORITIES = new Set(["normal", "high", "urgent"]);

const createInquiry = async (req, res) => {
  try {
    const { name, email, phone, subject, message, orderId, type, issueCategory, orderStatus, orderTotal, priority } = req.body || {};
    if (typeof name !== "string" || typeof email !== "string" || typeof message !== "string") {
      return res.status(400).json({ success: false, message: "Name, email, and message must be valid text values." });
    }

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanMsg = message.trim();

    if (cleanName.length < 2 || cleanName.length > 100) {
      return res.status(400).json({ success: false, message: "Name must be between 2 and 100 characters." });
    }
    if (!EMAIL_REGEX.test(cleanEmail) || cleanEmail.length > 120) {
      return res.status(400).json({ success: false, message: "Please provide a valid email address." });
    }
    if (cleanMsg.length < 2 || cleanMsg.length > 2000) {
      return res.status(400).json({ success: false, message: "Message must be between 2 and 2000 characters." });
    }

    const cleanOrderId = orderId ? String(orderId).trim().slice(0, 60) : "";
    const parsedType = VALID_TYPES.has(type) ? type : (cleanOrderId ? "order_issue" : "general");
    const parsedPriority = VALID_PRIORITIES.has(priority) ? priority : (cleanOrderId ? "high" : "normal");
    const parsedTotal = orderTotal !== undefined && Number.isFinite(Number(orderTotal)) && Number(orderTotal) >= 0
      ? Number(orderTotal)
      : 0;

    const newInquiry = await Inquiry.create({
      name: cleanName,
      email: cleanEmail,
      phone: typeof phone === "string" ? phone.trim().slice(0, 25) : "",
      subject: typeof subject === "string" && subject.trim()
        ? subject.trim().slice(0, 140)
        : (cleanOrderId ? `Order #${cleanOrderId} Help` : "General Inquiry"),
      message: cleanMsg,
      orderId: cleanOrderId,
      type: parsedType,
      issueCategory: typeof issueCategory === "string" ? issueCategory.trim().slice(0, 80) : "",
      orderStatus: typeof orderStatus === "string" ? orderStatus.trim().slice(0, 40) : "",
      orderTotal: parsedTotal,
      priority: parsedPriority,
      isResolved: false,
    });

    return res.status(201).json({
      success: true,
      message: cleanOrderId
        ? `Support ticket for Order #${cleanOrderId} submitted. Our kitchen team has been alerted!`
        : "Thank you for reaching out! Your message has been received.",
      inquiry: newInquiry,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getInquiries = async (_req, res) => {
  try {
    const inquiries = await Inquiry.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, inquiries });
  } catch (error) {
    return res.status(500).json({ success: false, inquiries: [], message: error.message });
  }
};

const deleteInquiry = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid inquiry ID." });
    }
    const inquiry = await Inquiry.findByIdAndDelete(req.params.id);
    if (!inquiry) return res.status(404).json({ success: false, message: "Inquiry not found" });
    return res.status(200).json({ success: true, message: "Inquiry deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const replyInquiry = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid inquiry ID." });
    }
    const { replyMessage } = req.body || {};
    if (typeof replyMessage !== "string" || !replyMessage.trim() || replyMessage.trim().length > 2000) {
      return res.status(400).json({ success: false, message: "Reply message must be 1–2000 characters." });
    }

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
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid inquiry ID." });
    }
    const existing = await Inquiry.findById(req.params.id);
    if (!existing) return res.status(404).json({ success: false, message: "Inquiry not found." });

    const nextState = req.body?.isResolved !== undefined ? Boolean(req.body.isResolved) : !existing.isResolved;
    existing.isResolved = nextState;
    if (nextState && existing.status === "New") existing.status = "Replied";
    await existing.save();

    return res.status(200).json({
      success: true,
      message: `Inquiry marked as ${nextState ? "Resolved" : "Pending"}`,
      inquiry: existing,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { createInquiry, getInquiries, deleteInquiry, replyInquiry, resolveInquiry };

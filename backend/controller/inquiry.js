const Inquiry = require("../models/inquiry");

// Submit new customer inquiry
const createInquiry = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "Please provide your name, email, and message."
      });
    }

    const newInquiry = await Inquiry.create({
      name,
      email,
      phone: phone || "",
      subject: subject || "General Inquiry",
      message
    });

    return res.status(201).json({
      success: true,
      message: "Thank you for reaching out! Your message has been received.",
      inquiry: newInquiry
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Admin: Get all customer inquiries
const getInquiries = async (req, res) => {
  try {
    const inquiries = await Inquiry.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, inquiries });
  } catch (error) {
    return res.status(500).json({ success: false, inquiries: [], message: error.message });
  }
};

// Admin: Delete an inquiry
const deleteInquiry = async (req, res) => {
  try {
    const inquiry = await Inquiry.findByIdAndDelete(req.params.id);
    if (!inquiry) {
      return res.status(404).json({ success: false, message: "Inquiry not found" });
    }
    return res.status(200).json({ success: true, message: "Inquiry deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Admin: Reply to an inquiry
const replyInquiry = async (req, res) => {
  try {
    const { replyMessage } = req.body;
    if (!replyMessage || !replyMessage.trim()) {
      return res.status(400).json({ success: false, message: "Reply message cannot be empty." });
    }

    const updated = await Inquiry.findByIdAndUpdate(
      req.params.id,
      {
        status: "Replied",
        replyMessage: replyMessage.trim(),
        repliedAt: new Date()
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: "Inquiry not found." });
    }

    return res.status(200).json({
      success: true,
      message: "Reply recorded successfully",
      inquiry: updated
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createInquiry,
  getInquiries,
  deleteInquiry,
  replyInquiry
};

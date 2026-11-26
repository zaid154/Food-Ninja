const express = require("express");
const router = express.Router();
const { createInquiry, getInquiries, deleteInquiry, replyInquiry, resolveInquiry } = require("../controllers/inquiryController");
const { requireAuth, requireAdmin } = require("../middleware/authMiddleware");
const { contactLimiter } = require("../middleware/securityMiddleware");

router.route("/")
  .get(requireAuth, requireAdmin, getInquiries)
  .post(contactLimiter, createInquiry);
router.route("/:id").delete(requireAuth, requireAdmin, deleteInquiry);
router.route("/:id/reply").put(requireAuth, requireAdmin, replyInquiry);
router.route("/:id/resolve").patch(requireAuth, requireAdmin, resolveInquiry).put(requireAuth, requireAdmin, resolveInquiry);

module.exports = router;

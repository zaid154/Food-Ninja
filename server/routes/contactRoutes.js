const express = require("express");
const router = express.Router();
const { createInquiry, getInquiries, deleteInquiry, replyInquiry, resolveInquiry } = require("../controllers/inquiryController");

router.route("/").get(getInquiries).post(createInquiry);
router.route("/:id").delete(deleteInquiry);
router.route("/:id/reply").put(replyInquiry);
router.route("/:id/resolve").patch(resolveInquiry).put(resolveInquiry);

module.exports = router;

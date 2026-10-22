const express = require("express");
const router = express.Router();
const {
  createInquiry,
  getInquiries,
  deleteInquiry,
  replyInquiry
} = require("../controller/inquiry");

router.route("/")
  .get(getInquiries)
  .post(createInquiry);

router.route("/:id")
  .delete(deleteInquiry);

router.route("/:id/reply")
  .put(replyInquiry);

module.exports = router;

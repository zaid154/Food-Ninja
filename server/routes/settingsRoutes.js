const express = require("express");
const router = express.Router();
const { getSettings, updateSettings } = require("../controllers/settingsController");
const { requireAuth, requireAdmin } = require("../middleware/authMiddleware");

router.route("/").get(getSettings).put(requireAuth, requireAdmin, updateSettings);

module.exports = router;

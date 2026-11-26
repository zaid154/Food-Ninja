const express = require("express");
const router = express.Router();
const { register, login, getMe, logout, getUsers, updateUserBlockStatus } = require("../controllers/userController");
const { requireAuth, requireAdmin } = require("../middleware/authMiddleware");
const { authLimiter } = require("../middleware/securityMiddleware");

router.post("/register", authLimiter, register);
router.post("/login", authLimiter, login);
router.post("/logout", logout);
router.get("/me", requireAuth, getMe);
router.get("/", requireAuth, requireAdmin, getUsers);
router.patch("/:id/block", requireAuth, requireAdmin, updateUserBlockStatus);

module.exports = router;

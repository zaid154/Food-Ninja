const express = require("express");
const router = express.Router();
const {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");
const { requireAuth, requireAdmin } = require("../middleware/authMiddleware");

router.route("/").get(getCategories).post(requireAuth, requireAdmin, createCategory);
router.route("/:id").put(requireAuth, requireAdmin, updateCategory).delete(requireAuth, requireAdmin, deleteCategory);

module.exports = router;

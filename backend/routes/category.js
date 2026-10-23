const express = require("express");
const router = express.Router();
const {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controller/category");

router.route("/").get(getCategories).post(createCategory);
router.route("/:id").put(updateCategory).delete(deleteCategory);

module.exports = router;

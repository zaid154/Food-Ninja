const express = require("express");
const router = express.Router();
const { getGroceries, getGrocery, addGrocery, updateGrocery, deleteGrocery } = require("../controller/grocery");

router.route("/").get(getGroceries).post(addGrocery);
router.route("/:id").get(getGrocery).put(updateGrocery).delete(deleteGrocery);

module.exports = router;

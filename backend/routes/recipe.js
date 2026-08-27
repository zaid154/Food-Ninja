const express = require("express");
const router = express.Router();
const { getRecipes, getRecipe, addRecipe, updateRecipe, deleteRecipe } = require("../controller/recipe");

router.route("/").get(getRecipes).post(addRecipe);
router.route("/:id").get(getRecipe).put(updateRecipe).delete(deleteRecipe);

module.exports = router;

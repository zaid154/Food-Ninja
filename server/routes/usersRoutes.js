const express = require("express");
const router = express.Router();
const { register, login, getUsers, updateUserBlockStatus } = require("../controllers/userController");

router.post("/register", register);
router.post("/login", login);
router.get("/", getUsers);
router.patch("/:id/block", updateUserBlockStatus);

module.exports = router;

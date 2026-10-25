const express = require("express");
const router = express.Router();
const { register, login, getUsers } = require("../controllers/userController");

router.post("/register", register);
router.post("/login", login);
router.get("/", getUsers);

module.exports = router;

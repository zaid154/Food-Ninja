const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../models/userModel");
const { getJwtSecret, getCookieOptions } = require("../middleware/securityMiddleware");

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const safeUserDto = (user) => ({
  id: user._id,
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  isBlocked: Boolean(user.isBlocked),
  phone: user.phone || "",
  address: user.address || "",
});

const signAuthToken = (user) =>
  jwt.sign(
    { id: String(user._id), role: user.role },
    getJwtSecret(),
    { algorithm: "HS256", expiresIn: "7d" }
  );

const register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body || {};
    if (typeof name !== "string" || typeof email !== "string" || typeof password !== "string") {
      return res.status(400).json({ message: "Name, email, and password must be valid text values." });
    }

    const cleanName = name.trim();
    const cleanEmail = email.toLowerCase().trim();
    const cleanPhone = typeof phone === "string" ? phone.trim().slice(0, 20) : "";

    if (cleanName.length < 2 || cleanName.length > 80) {
      return res.status(400).json({ message: "Name must be between 2 and 80 characters." });
    }
    if (!EMAIL_REGEX.test(cleanEmail) || cleanEmail.length > 120) {
      return res.status(400).json({ message: "Please provide a valid email address." });
    }
    if (password.length < 6 || password.length > 128) {
      return res.status(400).json({ message: "Password must be between 6 and 128 characters long." });
    }

    const existing = await User.findOne({ email: cleanEmail });
    if (existing) {
      return res.status(400).json({ message: "An account with this email already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new User({
      name: cleanName,
      email: cleanEmail,
      password: hashedPassword,
      phone: cleanPhone,
      role: "user", // Always force non-privileged role on public signup
      isBlocked: false,
    });
    await newUser.save();

    const token = signAuthToken(newUser);
    res.cookie("fn_token", token, getCookieOptions(false));

    return res.status(201).json({
      message: "User registered successfully!",
      token,
      user: safeUserDto(newUser),
    });
  } catch (error) {
    return res.status(500).json({ message: "Registration failed", error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (typeof email !== "string" || typeof password !== "string" || !email.trim() || !password) {
      return res.status(400).json({ message: "Valid email and password strings are required." });
    }

    const cleanEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: cleanEmail }).select("+password");
    if (!user || !user.password) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const isMatch = user.password.startsWith("$2")
      ? await bcrypt.compare(password, user.password)
      : false;

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password." });
    }
    if (user.isBlocked) {
      return res.status(403).json({ message: "This account is blocked. Please contact the restaurant for help." });
    }

    const token = signAuthToken(user);
    res.cookie("fn_token", token, getCookieOptions(false));

    return res.status(200).json({
      message: "Login successful!",
      token,
      user: safeUserDto(user),
    });
  } catch (error) {
    return res.status(500).json({ message: "Login failed", error: error.message });
  }
};

const getMe = async (req, res) => {
  return res.status(200).json({ success: true, user: safeUserDto(req.user) });
};

const logout = async (_req, res) => {
  res.clearCookie("fn_token", getCookieOptions(true));
  return res.status(200).json({ success: true, message: "Logged out successfully." });
};

const getUsers = async (_req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    return res.status(200).json({ users });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch users", error: error.message });
  }
};

const updateUserBlockStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isBlocked } = req.body || {};
    if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: "Invalid customer ID." });
    if (typeof isBlocked !== "boolean") return res.status(400).json({ message: "isBlocked must be true or false." });

    const user = await User.findById(id).select("-password");
    if (!user) return res.status(404).json({ message: "Customer not found." });
    if (user.role === "admin" || String(user._id) === String(req.user._id)) {
      return res.status(403).json({ message: "Admin accounts cannot be blocked." });
    }

    user.isBlocked = isBlocked;
    await user.save();

    return res.status(200).json({
      message: isBlocked ? "Customer blocked successfully." : "Customer unblocked successfully.",
      user: safeUserDto(user),
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to update customer status", error: error.message });
  }
};

module.exports = { register, login, getMe, logout, getUsers, updateUserBlockStatus };

const User = require("../models/userModel");
const mongoose = require("mongoose");

// Register new user
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: "An account with this email already exists." });
    }

    const newUser = new User({
      name,
      email: email.toLowerCase(),
      password, // in simple projects without bcrypt or plain demo
      role: email.toLowerCase() === "admin@foodninja.com" ? "admin" : "user",
    });

    await newUser.save();
    return res.status(201).json({
      message: "User registered successfully!",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Registration failed", error: error.message });
  }
};

// Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase(), password });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }
    if (user.isBlocked) {
      return res.status(403).json({ message: "This account is blocked. Please contact the restaurant for help." });
    }

    return res.status(200).json({
      message: "Login successful!",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Login failed", error: error.message });
  }
};

// Get all users (for admin overview)
const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    return res.status(200).json({ users });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch users", error: error.message });
  }
};

// Admin: block or unblock a customer account.
const updateUserBlockStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isBlocked } = req.body || {};
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid customer ID." });
    }
    if (typeof isBlocked !== "boolean") {
      return res.status(400).json({ message: "isBlocked must be true or false." });
    }

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "Customer not found." });
    if (user.role === "admin") {
      return res.status(403).json({ message: "Admin accounts cannot be blocked." });
    }

    user.isBlocked = isBlocked;
    await user.save();
    const safeUser = user.toObject();
    delete safeUser.password;
    return res.status(200).json({
      message: isBlocked ? "Customer blocked successfully." : "Customer unblocked successfully.",
      user: safeUser,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to update customer status", error: error.message });
  }
};

module.exports = { register, login, getUsers, updateUserBlockStatus };

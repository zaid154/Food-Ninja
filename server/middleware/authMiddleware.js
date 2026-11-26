const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const { getJwtSecret } = require("./securityMiddleware");

const extractToken = (req) => {
  const authHeader = req.headers.authorization;
  if (typeof authHeader === "string" && authHeader.startsWith("Bearer ")) {
    const token = authHeader.slice(7).trim();
    if (token) return token;
  }
  if (req.cookies && typeof req.cookies.fn_token === "string" && req.cookies.fn_token.trim()) {
    return req.cookies.fn_token.trim();
  }
  return null;
};

const verifyUserFromRequest = async (req) => {
  const token = extractToken(req);
  if (!token) return { status: 401, message: "Authentication required. Please log in." };

  let decoded;
  try {
    decoded = jwt.verify(token, getJwtSecret(), { algorithms: ["HS256"] });
  } catch (err) {
    if (err.message && err.message.includes("JWT_SECRET")) {
      throw err;
    }
    return { status: 401, message: "Invalid or expired session token. Please log in again." };
  }

  if (!decoded || !decoded.id) {
    return { status: 401, message: "Invalid authentication token." };
  }

  const user = await User.findById(decoded.id).select("-password");
  if (!user) {
    return { status: 401, message: "Account no longer exists. Please sign in again." };
  }
  if (user.isBlocked) {
    return { status: 403, message: "This account is blocked. Please contact the restaurant for help." };
  }
  if (user.passwordChangedAt && decoded.iat) {
    const changedAtSec = Math.floor(user.passwordChangedAt.getTime() / 1000);
    if (decoded.iat < changedAtSec) {
      return { status: 401, message: "Password was recently changed. Please log in again." };
    }
  }

  return { user };
};

const requireAuth = async (req, res, next) => {
  try {
    const result = await verifyUserFromRequest(req);
    if (result.user) {
      req.user = result.user;
      return next();
    }
    return res.status(result.status).json({ success: false, message: result.message });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Authentication check failed." });
  }
};

const optionalAuth = async (req, _res, next) => {
  try {
    const token = extractToken(req);
    if (!token) {
      req.user = null;
      return next();
    }
    const result = await verifyUserFromRequest(req);
    req.user = result.user || null;
  } catch {
    req.user = null;
  }
  return next();
};

const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: "Authentication required." });
  }
  if (req.user.role !== "admin") {
    return res.status(403).json({ success: false, message: "Forbidden: Administrator access required." });
  }
  return next();
};

module.exports = {
  extractToken,
  requireAuth,
  optionalAuth,
  requireAdmin,
};

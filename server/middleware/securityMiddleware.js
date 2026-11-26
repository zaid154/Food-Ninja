const rateLimit = require("express-rate-limit");

const isProd = process.env.NODE_ENV === "production";

const escapeRegex = (value) => (value ? String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&") : "");

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("JWT_SECRET environment variable must be set and at least 32 characters long.");
  }
  return secret;
};

const getCookieOptions = (isLogout = false) => ({
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? "none" : "lax",
  path: "/",
  ...(isLogout ? { maxAge: 0 } : { maxAge: 7 * 24 * 60 * 60 * 1000 }),
});

/** Recursively strips MongoDB operator keys ($) and null bytes without mutating Express 5 req.query getter. */
const sanitizeMongoOperators = (value) => {
  if (typeof value === "string") return value.replace(/\0/g, "");
  if (Array.isArray(value)) return value.map(sanitizeMongoOperators);
  if (value && typeof value === "object" && !(value instanceof Date)) {
    const clean = {};
    for (const [key, val] of Object.entries(value)) {
      if (
        key.startsWith("$") ||
        key.includes(".") ||
        key === "__proto__" ||
        key === "constructor" ||
        key === "prototype"
      ) {
        continue;
      }
      clean[key] = sanitizeMongoOperators(val);
    }
    return clean;
  }
  return value;
};

const sanitizeRequest = (req, _res, next) => {
  if (req.body && typeof req.body === "object") {
    req.body = sanitizeMongoOperators(req.body);
  }
  if (req.params && typeof req.params === "object") {
    for (const key of Object.keys(req.params)) {
      if (typeof req.params[key] === "string") {
        req.params[key] = req.params[key].replace(/\0/g, "");
      }
    }
  }
  next();
};

const isValidHttpUrl = (value, { allowEmpty = true } = {}) => {
  if (value === undefined || value === null || String(value).trim() === "") return allowEmpty;
  try {
    const parsed = new URL(String(value).trim());
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
};

const createLimiter = (windowMs, max, message) =>
  rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message },
  });

const authLimiter = createLimiter(
  15 * 60 * 1000,
  20,
  "Too many authentication attempts. Please try again in 15 minutes."
);

const checkoutLimiter = createLimiter(
  15 * 60 * 1000,
  30,
  "Too many checkout requests. Please try again shortly."
);

const contactLimiter = createLimiter(
  15 * 60 * 1000,
  15,
  "Too many support tickets submitted. Please wait a few minutes."
);

const apiLimiter = createLimiter(
  15 * 60 * 1000,
  400,
  "Too many requests from this IP. Please slow down."
);

module.exports = {
  escapeRegex,
  getJwtSecret,
  getCookieOptions,
  sanitizeMongoOperators,
  sanitizeRequest,
  isValidHttpUrl,
  authLimiter,
  checkoutLimiter,
  contactLimiter,
  apiLimiter,
};

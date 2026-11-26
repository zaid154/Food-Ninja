const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const connectDb = require("./config/connectionDb");
const { sanitizeRequest, apiLimiter } = require("./middleware/securityMiddleware");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5005;

app.set("trust proxy", 1);

// Connect to Database
connectDb();

const buildAllowedOrigins = () => {
  const defaults = [
    "http://localhost:1234",
    "http://localhost:3000",
    "http://localhost:5173",
    "https://foodninja-pro.vercel.app",
  ];
  const fromEnv = [process.env.CLIENT_URL, process.env.FRONTEND_URL]
    .filter(Boolean)
    .flatMap((v) => String(v).split(","))
    .map((v) => v.trim().replace(/\/$/, ""))
    .filter(Boolean);
  return new Set([...defaults, ...fromEnv]);
};

const allowedOrigins = buildAllowedOrigins();

const corsOptions = {
  origin(origin, callback) {
    if (!origin) return callback(null, true);
    const normalized = String(origin).trim().replace(/\/$/, "");
    if (allowedOrigins.has(normalized)) {
      return callback(null, true);
    }
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// Security Middlewares
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json({ limit: "250kb" }));
app.use(sanitizeRequest);
app.use("/api", apiLimiter);

// Routes
app.use("/api/recipes", require("./routes/recipesRoutes"));
app.use("/api/foods", require("./routes/recipesRoutes"));
app.use("/api/orders", require("./routes/ordersRoutes"));
app.use("/api/users", require("./routes/usersRoutes"));
app.use("/api/contact", require("./routes/contactRoutes"));
app.use("/api/reviews", require("./routes/reviewsRoutes"));
app.use("/api/categories", require("./routes/categoriesRoutes"));
app.use("/api/settings", require("./routes/settingsRoutes"));
app.use("/api/payment", require("./routes/paymentRoutes"));

// Health Check
app.get("/", (req, res) => {
  res.json({
    status: "online",
    message: "Food Ninja Server is running successfully",
  });
});

// Error Handler (never leak stack traces in production)
app.use((err, _req, res, _next) => {
  if (err && err.message === "Not allowed by CORS") {
    return res.status(403).json({ success: false, message: "Origin not allowed by CORS" });
  }
  if (err && err.type === "entity.parse.failed") {
    return res.status(400).json({ success: false, message: "Malformed JSON payload" });
  }
  const status = err?.status || 500;
  return res.status(status).json({
    success: false,
    message: process.env.NODE_ENV === "production" ? "Internal server error" : (err?.message || "Internal server error"),
  });
});

// Start Server when invoked directly
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Food Ninja Server running at http://localhost:${PORT}`);
  });
}

module.exports = app;

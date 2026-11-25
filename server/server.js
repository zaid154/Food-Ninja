const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDb = require("./config/connectionDb");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5005;

// Connect to Database
connectDb();

// Middlewares
app.use(cors());
app.use(express.json());

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
    message: "Food Ninja Server is running successfully"
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Food Ninja Server running at http://localhost:${PORT}`);
});

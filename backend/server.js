const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDb = require("./config/connectionDb");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to Database
connectDb();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/recipes", require("./routes/recipe"));
app.use("/api/groceries", require("./routes/grocery"));
app.use("/api/orders", require("./routes/order"));
app.use("/api/users", require("./routes/user"));

// Health check
app.get("/", (req, res) => {
  res.json({
    status: "online",
    message: "Food Ninja Delivery Platform Server is Running Successfully!",
  });
});

// Start Server
app.listen(PORT, () => {
  console.log("=================================================");
  console.log(`Food Ninja Server running at http://localhost:${PORT}`);
  console.log("=================================================");
});

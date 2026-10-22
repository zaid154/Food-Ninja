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
app.use("/api/recipes", require("./routes/recipe"));
app.use("/api/foods", require("./routes/recipe"));
app.use("/api/orders", require("./routes/order"));
app.use("/api/users", require("./routes/user"));
app.use("/api/contact", require("./routes/inquiry"));

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

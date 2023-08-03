const express = require("express");
const color = require("colors");
const app = express();
const port = process.env.PORT || 5000;
const db = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const regionRoutes = require("./routes/regionRoutes")
const userRoutes = require("./routes/userRoutes") 
const adminRoutes = require("./routes/adminRoutes")
const requestRoutes = require("./routes/requestRoutes")
const { errorHandler } = require("./middlewares/errorMiddleware");
const cors = require('cors');

require("dotenv").config();

// Connect to database
// connectDB();

// Enable CORS for all routes
app.use(cors());

// Middleware that enable us to allow json format into our api
app.use(express.json({ extended: false })); 

// Define Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/auth", regionRoutes);
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/auth", adminRoutes);
app.use("/api/v1/auth", requestRoutes);

app.use(errorHandler);

(async () => {
  await db.connectDB();

  app.listen(port, () =>
    console.log(`Electricity App API running on port ${port} 🚀`)
  );
})();

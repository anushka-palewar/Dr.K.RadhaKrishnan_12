const express = require("express");
const cookieParser = require("cookie-parser");

const corsMiddleware = require("./MiddleWare/cors_connection");
const helloRoutes = require("./Routes/helloRoutes");
const authRoutes = require("./Routes/authRoutes");
const aiRoutes = require("./Routes/aiRoutes");

const app = express();

// 🔹 1. CORS FIRST
app.use(corsMiddleware);

// 🔹 2. Core middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// 🔹 3. Routes
app.use("/api", helloRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/ai", aiRoutes);

// 🔹 4. Global error handler
app.use((err, req, res, next) => {
  console.error(err);

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error"
  });
});

module.exports = app;

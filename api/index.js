require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const path = require("path");
const { sequelize, initializeDatabase } = require("../config/db.js");
const { swaggerSpec, swaggerUi } = require("../swaggerconfig.js");

// ========================
// Route Imports
// ========================
const tinytownRoutes = require("../routes/tinytown.routes.js"); // Active Project

const app = express();

// ========================
// Middleware Setup
// ========================
app.use(helmet());
app.use(express.json({ limit: `${process.env.MAX_FILE_SIZE || 50}mb` }));
app.use(express.urlencoded({ extended: true }));

const corsOptions = {
  origin:
    process.env.ALLOWED_ORIGINS === "*"
      ? "*"
      : process.env.ALLOWED_ORIGINS.split(","),
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "x-api-key",
    "x-api-admin-key",
  ],
  credentials: true,
};
app.use(cors(corsOptions));

// Logging (Development mode)
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Rate Limiting (Security)
app.use(
  rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 1000,
    message: "Too many requests from this IP, please try again later.",
  })
);

// Static Folders (Images/QR Codes)
app.use("/public", express.static(path.join(__dirname, "../public"), {
    setHeaders: (res) => {
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    },
}));

// Swagger Documentation
app.use("/localbites-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ========================
// Active Routes
// ========================

// Root Health Check
app.get("/", (req, res) => {
  res.json({
    message: "🚀 Tiny Town API is running successfully",
    status: "Active",
    env: process.env.NODE_ENV,
    timestamp: new Date().toISOString()
  });
});

// TINY TOWN PROJECT ROUTES
app.use("/api/tinytown", tinytownRoutes);

// ========================
// Database & Server Start
// ========================
const startServer = async () => {
  try {
    await initializeDatabase(); 
    console.log('✅ Database initialized successfully');
  } catch (error) {
    console.error("❌ Database initialization error:", error.message);
  }
};

// Initialize database connection
startServer();

// Vercel serverless function handler
module.exports = (req, res) => {
  app(req, res);
};
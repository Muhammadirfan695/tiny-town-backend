require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const path = require("path");
const { sequelize, initializeDatabase } = require("./config/db.js");
const { swaggerSpec, swaggerUi } = require("./swaggerconfig.js");

// ========================
// Route Imports
// ========================
const tinytownRoutes = require("./routes/tinytown.routes.js"); // Active Project

/* 
// Commented out other project routes
const authRoutes = require("./routes/auth.routes.js");
const adminRoutes = require("./routes/admin.routes.js");
const userRoutes = require("./routes/user.routes.js");
const dishRoutes = require("./routes/dish.routes.js");
const restaurantRoutes = require("./routes/restaurant.routes.js");
const menuRoutes = require("./routes/menu.routes.js");
const dashboardRoutes = require("./routes/dashboard.routes.js");
const newsletterRoutes = require("./routes/newsletter.routes.js");
*/

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
app.use(
  "/public",
  express.static(path.join(__dirname, "public"), {
    setHeaders: (res) => {
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    },
  })
);

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
  });
});

// TINY TOWN PROJECT ROUTES
app.use("/api/tinytown", tinytownRoutes);

/* 
// Disabled LocalBites Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/user", userRoutes);
app.use("/api/dishes", dishRoutes);
app.use("/api/restaurants", restaurantRoutes);
app.use("/api/menus", menuRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/newsletters", newsletterRoutes);
*/

// ========================
// Database & Server Start
// ========================
const startServer = async () => {
  try {
    // Database Connection & Sync
    await initializeDatabase(); 

    const PORT = process.env.PORT || 5000;
    const HOST = process.env.HOST || "0.0.0.0";

    app.listen(PORT, HOST, () => {
      console.log("--------------------------------------------------");
      console.log(`✅ SERVER LIVE: http://localhost:${PORT}`);
      console.log(`🚀 PROJECT: Tiny Town Kids Wear`);
      console.log(`📂 MODE: ${process.env.NODE_ENV}`);
      console.log("--------------------------------------------------");
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();

module.exports = app;
require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const path = require("path");

const app = express();

app.use(helmet());
app.use(express.json({ limit: `${process.env.MAX_FILE_SIZE || 50}mb` }));
app.use(express.urlencoded({ extended: true }));

// CORS middleware - must be before routes
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, x-api-key, x-api-admin-key");
  res.setHeader("Access-Control-Max-Age", "86400");
  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }
  next();
});

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 1000,
  message: "Too many requests from this IP, please try again later.",
}));

app.use("/public", express.static(path.join(__dirname, "../public"), {
  setHeaders: (res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
  },
}));

app.get("/", (req, res) => {
  res.json({
    message: "🚀 Tiny Town API is running successfully",
    status: "Active",
    env: process.env.NODE_ENV,
  });
});

const startServer = async () => {
  let dbConnected = false;
  
  try {
    const { initializeDatabase } = require("../config/db.js");
    dbConnected = await initializeDatabase();
  } catch (error) {
    console.warn("⚠️ Database init failed:", error.message);
  }
  
  const tinytownRoutes = require("../routes/tinytown.routes.js");
  app.use("/api/tinytown", tinytownRoutes);
  
  if (dbConnected) {
    console.log("✅ Database connected. Routes active.");
  } else {
    console.warn("⚠️ Database NOT connected. Routes active but DB operations will fail.");
  }

  if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`✅ Local Server running on port ${PORT}`);
    });
  }
};

startServer();

const server = app;

module.exports = server;
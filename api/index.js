require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const path = require("path");

const app = express();

app.use(helmet());
app.use(express.json({ limit: `${process.env.MAX_FILE_SIZE || 50}mb` }));
app.use(express.urlencoded({ extended: true }));

let allowedOrigins = process.env.ALLOWED_ORIGINS || "*";
if (allowedOrigins === "*") {
  allowedOrigins = "*";
} else if (allowedOrigins) {
  allowedOrigins = allowedOrigins.split(",");
} else {
  allowedOrigins = "*";
}

const corsOptions = {
  origin: allowedOrigins,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "x-api-key", "x-api-admin-key"],
  credentials: true,
};
app.use(cors(corsOptions));

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
  try {
    const { initializeDatabase } = require("../config/db.js");
    const dbConnected = await initializeDatabase();
    
    if (dbConnected) {
      const tinytownRoutes = require("../routes/tinytown.routes.js");
      app.use("/api/tinytown", tinytownRoutes);
    } else {
      console.warn("⚠️ Database not connected. Tinytown routes disabled.");
    }

    if (process.env.NODE_ENV !== 'production') {
      const PORT = process.env.PORT || 5000;
      app.listen(PORT, () => {
        console.log(`✅ Local Server running on port ${PORT}`);
      });
    }
  } catch (error) {
    console.error("❌ Startup Error:", error.message);
  }
};

startServer();

module.exports = app;
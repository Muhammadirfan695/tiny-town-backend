require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const path = require("path");
const { sequelize, initializeDatabase } = require("./config/db.js");
const { swaggerSpec, swaggerUi } = require("./swaggerconfig.js");

const authRoutes = require('./routes/auth.routes.js')
const adminRoutes = require('./routes/admin.routes.js')
const userRoutes = require('./routes/user.routes.js')
const dishRoutes = require('./routes/dish.routes.js')
const restaurantRoutes = require('./routes/restaurant.routes.js')
const menuRoutes = require('./routes/menu.routes.js')


const app = express();

// ========================
// Middleware
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
  allowedHeaders: ["Content-Type", "Authorization", "x-api-key", "x-api-admin-key"],
  credentials: true,
};
app.use(cors(corsOptions));

// Logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Rate Limiting
app.use(
  rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
    message: "Too many requests from this IP, please try again later.",
  })
);

// Static uploads
app.use(
  "/public",
  express.static(path.join(__dirname, "public"), {
    setHeaders: (res) => {
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    },
  })
);

app.use('/localbites', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
// ========================
// Routes
// ========================
// app.get("/", (req, res) => {
//     res.json({
//         message: "🚀 API is running successfully",
//         env: process.env.NODE_ENV,
//     });
// });
app.get("/", async (req, res) => {
  try {
    res.json({
      message: "🚀 API is running successfully",
      env: process.env.NODE_ENV,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error generating PDF", error: error.message });
  }
});
app.use("/api/auth", authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/user', userRoutes);
app.use('/api/dishes', dishRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/menus', menuRoutes)
// ========================
// Database & Server Start
// ========================
const startServer = async () => {
  try {
    await initializeDatabase(); // ensures DB connection & optional sync

    const PORT = process.env.PORT || 5000;
    const HOST = process.env.HOST || "0.0.0.0";

    app.listen(PORT, HOST, () => {
      console.log(`✅ Server running at http://${HOST}:${PORT} in ${process.env.NODE_ENV} mode`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();

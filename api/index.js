require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const path = require("path");

const app = express();

app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(express.json({ limit: `${process.env.MAX_FILE_SIZE || 50}mb` }));
app.use(express.urlencoded({ extended: true }));

// CORS - FIRST before everything
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,PATCH,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type,Authorization,x-api-key,x-api-admin-key");
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

app.get("/health", (req, res) => res.json({status:"ok"}));
app.get("/api/products", (req, res) => res.json({success:true,data:[
  {id:1,name:"Test",price:100}
]}));

app.get("/", (req, res) => {
  res.json({
    message: "🚀 Tiny Town API is running",
    status: "Active",
  });
});

app.get("/test", (req, res) => res.json({message:"test ok"}));

const tinytownRoutes = require("./routes/tinytown.routes.js");
app.use("/api/tinytown", tinytownRoutes);

module.exports = app;
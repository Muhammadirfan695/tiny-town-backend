const jwt = require("jsonwebtoken");
const expressAsyncHandler = require("express-async-handler");

const X_API_KEY = process.env.X_API_KEY || "localbitesuser";
const X_API_ADMIN_KEY = process.env.X_API_ADMIN_KEY || "localbitesadmin";
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// 1. API Key Auth
const apiKeyAuth = (req, res, next) => {
  const regularKey = process.env.X_API_KEY || "localbitesuser";
  const adminKey = process.env.X_API_ADMIN_KEY || "localbitesadmin";

  const reqApiKey = req.headers["x-api-key"];
  const reqAdminKey = req.headers["x-api-admin-key"];

  if (req.originalUrl.includes("/products") && req.method === "POST") {
    if (!reqAdminKey || reqAdminKey !== adminKey) {
      return res.status(401).json({ succeeded: false, message: "Admin API KEY Invalid" });
    }
    return next();
  }

  if (req.originalUrl.includes("/orders") && req.method === "GET") {
    if (!reqAdminKey || reqAdminKey !== adminKey) {
      return res.status(401).json({ succeeded: false, message: "Admin API KEY Invalid" });
    }
    return next();
  }

  if (!reqApiKey || reqApiKey !== regularKey) {
    return res.status(401).json({ succeeded: false, message: "Regular API KEY Invalid" });
  }
  next();
};

// 2. JWT Protect (Yeh missing tha aapke code mein)
const protect = expressAsyncHandler(async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return res.status(401).json({ succeeded: false, message: "Not Authorized" });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.id;
    req.userRole = decoded.role;
    next();
  } catch (error) {
    return res.status(401).json({ succeeded: false, message: "Invalid Token" });
  }
});

// 3. Authorize (Yeh bhi missing tha)
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.userRole)) {
      return res.status(403).json({ succeeded: false, message: "Permission Denied" });
    }
    next();
  };
};

module.exports = { apiKeyAuth, protect, authorize };
require("dotenv").config();

module.exports = (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-api-key, x-api-admin-key');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  try {
    // Basic health check response
    res.status(200).json({
      message: "🚀 Tiny Town API is running successfully",
      status: "Active",
      env: process.env.NODE_ENV || "development",
      timestamp: new Date().toISOString(),
      method: req.method,
      url: req.url
    });
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({
      error: "Internal Server Error",
      message: error.message
    });
  }
};
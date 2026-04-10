// Vercel API route for products
let products = [
  { id: 1, name: "Kids T-Shirt", price: 599, image: "https://via.placeholder.com/300", isNew: true },
  { id: 2, name: "Baby Dress", price: 899, image: "https://via.placeholder.com/300", isNew: false },
  { id: 3, name: "Winter Jacket", price: 1299, image: "https://via.placeholder.com/300", isNew: true },
];

module.exports = (req, res) => {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, x-api-key");
  
  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method === "GET") {
    return res.status(200).json({ success: true, data: products });
  }

  res.status(405).json({ error: "Method not allowed" });
};

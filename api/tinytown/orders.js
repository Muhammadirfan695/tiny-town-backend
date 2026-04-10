// Vercel API route for orders
let orders = [];

module.exports = (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, x-api-key");
  
  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method === "POST") {
    const order = { id: orders.length + 1, ...req.body, createdAt: new Date() };
    orders.push(order);
    return res.status(201).json({ success: true, message: "Order placed!", data: order });
  }

  res.status(405).json({ error: "Method not allowed" });
};

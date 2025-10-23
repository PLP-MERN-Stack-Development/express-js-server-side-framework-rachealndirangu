// server.js - Complete Express.js RESTful API for Week 2 Assignment

// Import required modules
const express = require("express");
const bodyParser = require("body-parser");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// =============================
// 🔹 Middleware Setup
// =============================
app.use(bodyParser.json());

// Custom Logger Middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Authentication Middleware
function authMiddleware(req, res, next) {
  const apiKey = req.headers["x-api-key"];
  if (!apiKey || apiKey !== process.env.API_KEY) {
    return res.status(401).json({ message: "Unauthorized: Invalid API key" });
  }
  next();
}

// Validation Middleware
function validateProduct(req, res, next) {
  const { name, description, price, category, inStock } = req.body;
  if (!name || !description || price == null || !category || inStock == null) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  if (typeof price !== "number") {
    return res.status(400).json({ message: "Price must be a number" });
  }
  next();
}

// =============================
// 🔹 Sample In-Memory Database
// =============================
let products = [
  {
    id: "1",
    name: "Laptop",
    description: "High-performance laptop with 16GB RAM",
    price: 1200,
    category: "electronics",
    inStock: true,
  },
  {
    id: "2",
    name: "Smartphone",
    description: "Latest model with 128GB storage",
    price: 800,
    category: "electronics",
    inStock: true,
  },
  {
    id: "3",
    name: "Coffee Maker",
    description: "Programmable coffee maker with timer",
    price: 50,
    category: "kitchen",
    inStock: false,
  },
];

// =============================
// 🔹 Routes
// =============================

// Root route
app.get("/", (req, res) => {
  res.send("Welcome to the Product API! Visit /api/products to see all products.");
});

// GET /api/products - Get all products (with filtering, pagination, and search)
app.get("/api/products", (req, res) => {
  const { category, search, page = 1, limit = 5 } = req.query;
  let result = [...products];

  if (category) result = result.filter(p => p.category.toLowerCase() === category.toLowerCase());
  if (search)
    result = result.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  const start = (page - 1) * limit;
  const paginated = result.slice(start, start + Number(limit));

  res.json({ total: result.length, page: Number(page), limit: Number(limit), data: paginated });
});

// GET /api/products/:id - Get specific product
app.get("/api/products/:id", (req, res) => {
  const product = products.find(p => p.id === req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found" });
  res.json(product);
});

// POST /api/products - Create new product
app.post("/api/products", authMiddleware, validateProduct, (req, res) => {
  const newProduct = { id: uuidv4(), ...req.body };
  products.push(newProduct);
  res.status(201).json(newProduct);
});

// PUT /api/products/:id - Update product
app.put("/api/products/:id", authMiddleware, validateProduct, (req, res) => {
  const index = products.findIndex(p => p.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: "Product not found" });

  products[index] = { ...products[index], ...req.body };
  res.json(products[index]);
});

// DELETE /api/products/:id - Delete product
app.delete("/api/products/:id", authMiddleware, (req, res) => {
  const product = products.find(p => p.id === req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found" });

  products = products.filter(p => p.id !== req.params.id);
  res.status(204).send();
});

// GET /api/products/stats/category - Product statistics by category
app.get("/api/products/stats/category", (req, res) => {
  const stats = {};
  products.forEach(p => {
    stats[p.category] = (stats[p.category] || 0) + 1;
  });
  res.json(stats);
});

// =============================
// 🔹 Global Error Handling Middleware
// =============================
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.message);
  res.status(err.statusCode || 500).json({
    message: err.message || "Internal Server Error",
  });
});

// =============================
// 🔹 Start Server
// =============================
app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});

// Export app for testing
module.exports = app;

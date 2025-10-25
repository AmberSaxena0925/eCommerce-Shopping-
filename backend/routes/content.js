const express = require('express');
const router = express.Router();

const Collection = require('../models/Collection');
const Category = require('../models/Category');
const Product = require('../models/Product');

// Debug: log incoming requests to help diagnose 403/forbidden responses
router.use((req, res, next) => {
  try {
    const info = {
      method: req.method,
      url: req.originalUrl,
      ip: req.ip,
      auth: req.headers.authorization || null,
      x_admin: req.headers['x-admin-secret'] || null,
      origin: req.headers.origin || null,
    };
    console.log('[content route] incoming request:', JSON.stringify(info));
  } catch (err) {
    console.error('Failed to log request info', err);
  }
  next();
});

// GET /api/collections - optional ?featured=true
router.get('/collections', async (req, res) => {
  try {
    const q = {};
    if (req.query.featured === 'true') q.featured = true;
    const collections = await Collection.find(q).sort({ createdAt: -1 });
    console.log(`[content route] collections returned: ${Array.isArray(collections) ? collections.length : 0}`);
    res.json(collections);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/categories
router.get('/categories', async (req, res) => {
  try {
    const categories = await Category.find({}).sort({ name: 1 });
    console.log(`[content route] categories returned: ${Array.isArray(categories) ? categories.length : 0}`);
    res.json(categories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/products - optional ?featured=true or ?category_id=<id>
router.get('/products', async (req, res) => {
  try {
    const q = {};
    if (req.query.featured === 'true') q.featured = true;
    if (req.query.category_id) q.category_id = req.query.category_id;

    const products = await Product.find(q).sort({ createdAt: -1 });
    console.log(`[content route] products returned: ${Array.isArray(products) ? products.length : 0} (query: ${JSON.stringify(req.query)})`);
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/products/:slug
router.get('/products/:slug', async (req, res) => {
  try {
    const p = await Product.findOne({ slug: req.params.slug });
    if (!p) return res.status(404).json({ message: 'Product not found' });
    res.json(p);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

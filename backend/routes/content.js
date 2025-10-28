// routes/content.js
const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Collection = require('../models/Collection');
const Category = require('../models/Category');

// ==================== PUBLIC PRODUCT ROUTES ====================

// GET /api/products - Get all products (public)
router.get('/products', async (req, res) => {
  try {
    const { featured, category, collection, limit } = req.query;

    // Build query
    let query = {};
    
    if (featured === 'true') {
      query.featured = true;
    }
    
    if (category) {
      const cat = await Category.findOne({ slug: category });
      if (cat) {
        query.category_id = cat._id;
      }
    }
    
    if (collection) {
      const col = await Collection.findOne({ slug: collection });
      if (col) {
        query.collection_id = col._id;
      }
    }

    console.log('Products query:', query);

    let productsQuery = Product.find(query)
      .populate('category_id', 'name slug')
      .populate('collection_id', 'name slug')
      .sort({ createdAt: -1 });

    if (limit) {
      productsQuery = productsQuery.limit(parseInt(limit));
    }

    const products = await productsQuery;

    console.log(`Found ${products.length} products`);

    // Transform to frontend format
    const transformed = products.map(p => ({
      id: p._id.toString(),
      _id: p._id.toString(),
      name: p.name,
      slug: p.slug,
      description: p.description,
      price: p.price,
      images: p.images,
      materials: p.materials,
      in_stock: p.in_stock,
      featured: p.featured,
      // Return lowercase category name for filtering
      category: p.category_id?.name?.toLowerCase() || p.category_id?.slug?.toLowerCase() || '',
      category_id: p.category_id,
      collection_id: p.collection_id,
    }));

    res.json(transformed);
  } catch (err) {
    console.error('Failed to fetch products', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/products/:slug - Get single product by slug (public)
router.get('/products/:slug', async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug })
      .populate('category_id', 'name slug')
      .populate('collection_id', 'name slug');

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Transform to frontend format
    const transformed = {
      id: product._id.toString(),
      _id: product._id.toString(),
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: product.price,
      images: product.images,
      materials: product.materials,
      in_stock: product.in_stock,
      featured: product.featured,
      category: product.category_id?.name || '',
      category_id: product.category_id,
      collection_id: product.collection_id,
    };

    res.json(transformed);
  } catch (err) {
    console.error('Failed to fetch product', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ==================== PUBLIC COLLECTION ROUTES ====================

// GET /api/collections - Get all collections (public)
router.get('/collections', async (req, res) => {
  try {
    const { featured } = req.query;

    let query = {};
    if (featured === 'true') {
      query.featured = true;
    }

    const collections = await Collection.find(query).sort({ createdAt: -1 });

    // Transform to frontend format
    const transformed = collections.map(c => ({
      id: c._id.toString(),
      _id: c._id.toString(),
      name: c.name,
      slug: c.slug,
      description: c.description,
      image_url: c.image_url,
      featured: c.featured,
    }));

    res.json(transformed);
  } catch (err) {
    console.error('Failed to fetch collections', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/collections/:slug - Get single collection by slug (public)
router.get('/collections/:slug', async (req, res) => {
  try {
    const collection = await Collection.findOne({ slug: req.params.slug });

    if (!collection) {
      return res.status(404).json({ message: 'Collection not found' });
    }

    // Get products in this collection
    const products = await Product.find({ collection_id: collection._id })
      .populate('category_id', 'name slug')
      .sort({ createdAt: -1 });

    const transformed = {
      id: collection._id.toString(),
      _id: collection._id.toString(),
      name: collection.name,
      slug: collection.slug,
      description: collection.description,
      image_url: collection.image_url,
      featured: collection.featured,
      products: products.map(p => ({
        id: p._id.toString(),
        name: p.name,
        slug: p.slug,
        price: p.price,
        images: p.images,
        in_stock: p.in_stock,
      })),
    };

    res.json(transformed);
  } catch (err) {
    console.error('Failed to fetch collection', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ==================== PUBLIC CATEGORY ROUTES ====================

// GET /api/categories - Get all categories (public)
router.get('/categories', async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });

    const transformed = categories.map(c => ({
      id: c._id.toString(),
      _id: c._id.toString(),
      name: c.name,
      slug: c.slug,
    }));

    res.json(transformed);
  } catch (err) {
    console.error('Failed to fetch categories', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
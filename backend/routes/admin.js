// routes/admin.js
const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Collection = require('../models/Collection');
const Category = require('../models/Category');
const { adminMiddleware } = require('../middleware/admin');

// Apply admin middleware to all routes in this file
router.use(adminMiddleware);

// ==================== PRODUCTS ====================

// GET /api/admin/products - Get all products with pagination
router.get('/products', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const products = await Product.find()
      .populate('category_id', 'name slug')
      .populate('collection_id', 'name slug')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Product.countDocuments();

    res.json({
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error('Failed to fetch products', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/admin/products/:id - Get single product
router.get('/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category_id')
      .populate('collection_id');

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (err) {
    console.error('Failed to fetch product', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/admin/products - Create new product
router.post('/products', async (req, res) => {
  try {
    const {
      name,
      slug,
      description,
      price,
      category_id,
      collection_id,
      images,
      materials,
      in_stock,
      featured,
    } = req.body;

    // Validation
    if (!name || !slug || price === undefined) {
      return res.status(400).json({ 
        message: 'Missing required fields: name, slug, and price are required' 
      });
    }

    // Check if slug already exists
    const existingProduct = await Product.findOne({ slug });
    if (existingProduct) {
      return res.status(400).json({ 
        message: 'Product with this slug already exists' 
      });
    }

    // Validate category exists if provided
    if (category_id) {
      const categoryExists = await Category.findById(category_id);
      if (!categoryExists) {
        return res.status(400).json({ message: 'Invalid category_id' });
      }
    }

    // Validate collection exists if provided
    if (collection_id) {
      const collectionExists = await Collection.findById(collection_id);
      if (!collectionExists) {
        return res.status(400).json({ message: 'Invalid collection_id' });
      }
    }

    const product = new Product({
      name,
      slug,
      description: description || '',
      price,
      category_id: category_id || null,
      collection_id: collection_id || null,
      images: images || [],
      materials: materials || [],
      in_stock: in_stock !== undefined ? in_stock : true,
      featured: featured || false,
    });

    await product.save();

    const populatedProduct = await Product.findById(product._id)
      .populate('category_id')
      .populate('collection_id');

    res.status(201).json({ 
      message: 'Product created successfully',
      product: populatedProduct 
    });
  } catch (err) {
    console.error('Failed to create product', err);
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Product with this slug already exists' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/admin/products/:id - Update product
router.put('/products/:id', async (req, res) => {
  try {
    const {
      name,
      slug,
      description,
      price,
      category_id,
      collection_id,
      images,
      materials,
      in_stock,
      featured,
    } = req.body;

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if slug is being changed and if it already exists
    if (slug && slug !== product.slug) {
      const existingProduct = await Product.findOne({ slug });
      if (existingProduct) {
        return res.status(400).json({ 
          message: 'Product with this slug already exists' 
        });
      }
    }

    // Validate category if being updated
    if (category_id && category_id !== product.category_id?.toString()) {
      const categoryExists = await Category.findById(category_id);
      if (!categoryExists) {
        return res.status(400).json({ message: 'Invalid category_id' });
      }
    }

    // Validate collection if being updated
    if (collection_id && collection_id !== product.collection_id?.toString()) {
      const collectionExists = await Collection.findById(collection_id);
      if (!collectionExists) {
        return res.status(400).json({ message: 'Invalid collection_id' });
      }
    }

    // Update fields
    if (name) product.name = name;
    if (slug) product.slug = slug;
    if (description !== undefined) product.description = description;
    if (price !== undefined) product.price = price;
    if (category_id !== undefined) product.category_id = category_id;
    if (collection_id !== undefined) product.collection_id = collection_id;
    if (images !== undefined) product.images = images;
    if (materials !== undefined) product.materials = materials;
    if (in_stock !== undefined) product.in_stock = in_stock;
    if (featured !== undefined) product.featured = featured;

    await product.save();

    const updatedProduct = await Product.findById(product._id)
      .populate('category_id')
      .populate('collection_id');

    res.json({ 
      message: 'Product updated successfully',
      product: updatedProduct 
    });
  } catch (err) {
    console.error('Failed to update product', err);
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Product with this slug already exists' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/admin/products/:id - Delete product
router.delete('/products/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    console.error('Failed to delete product', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ==================== COLLECTIONS ====================

// GET /api/admin/collections - Get all collections
router.get('/collections', async (req, res) => {
  try {
    const collections = await Collection.find().sort({ createdAt: -1 });
    res.json(collections);
  } catch (err) {
    console.error('Failed to fetch collections', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/admin/collections/:id - Get single collection
router.get('/collections/:id', async (req, res) => {
  try {
    const collection = await Collection.findById(req.params.id);

    if (!collection) {
      return res.status(404).json({ message: 'Collection not found' });
    }

    // Optionally get products in this collection
    const products = await Product.find({ collection_id: collection._id })
      .select('name slug price images in_stock');

    res.json({ collection, products });
  } catch (err) {
    console.error('Failed to fetch collection', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/admin/collections - Create new collection
router.post('/collections', async (req, res) => {
  try {
    const { name, slug, description, image_url, featured } = req.body;

    // Validation
    if (!name || !slug) {
      return res.status(400).json({ 
        message: 'Missing required fields: name and slug are required' 
      });
    }

    // Check if slug already exists
    const existingCollection = await Collection.findOne({ slug });
    if (existingCollection) {
      return res.status(400).json({ 
        message: 'Collection with this slug already exists' 
      });
    }

    const collection = new Collection({
      name,
      slug,
      description: description || '',
      image_url: image_url || '',
      featured: featured || false,
    });

    await collection.save();

    res.status(201).json({ 
      message: 'Collection created successfully',
      collection 
    });
  } catch (err) {
    console.error('Failed to create collection', err);
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Collection with this slug already exists' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/admin/collections/:id - Update collection
router.put('/collections/:id', async (req, res) => {
  try {
    const { name, slug, description, image_url, featured } = req.body;

    const collection = await Collection.findById(req.params.id);
    if (!collection) {
      return res.status(404).json({ message: 'Collection not found' });
    }

    // Check if slug is being changed and if it already exists
    if (slug && slug !== collection.slug) {
      const existingCollection = await Collection.findOne({ slug });
      if (existingCollection) {
        return res.status(400).json({ 
          message: 'Collection with this slug already exists' 
        });
      }
    }

    // Update fields
    if (name) collection.name = name;
    if (slug) collection.slug = slug;
    if (description !== undefined) collection.description = description;
    if (image_url !== undefined) collection.image_url = image_url;
    if (featured !== undefined) collection.featured = featured;

    await collection.save();

    res.json({ 
      message: 'Collection updated successfully',
      collection 
    });
  } catch (err) {
    console.error('Failed to update collection', err);
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Collection with this slug already exists' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/admin/collections/:id - Delete collection
router.delete('/collections/:id', async (req, res) => {
  try {
    const collection = await Collection.findById(req.params.id);
    
    if (!collection) {
      return res.status(404).json({ message: 'Collection not found' });
    }

    // Check if any products are using this collection
    const productsCount = await Product.countDocuments({ collection_id: collection._id });
    
    if (productsCount > 0) {
      return res.status(400).json({ 
        message: `Cannot delete collection. ${productsCount} product(s) are still assigned to it.` 
      });
    }

    await Collection.findByIdAndDelete(req.params.id);

    res.json({ message: 'Collection deleted successfully' });
  } catch (err) {
    console.error('Failed to delete collection', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
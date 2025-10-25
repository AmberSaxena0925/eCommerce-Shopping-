/**
 * Simple seed script to populate categories, collections and some products.
 * Run with: node scripts/seed.js (ensure MONGO_URI in env)
 */
const mongoose = require('mongoose');
require('dotenv').config();

const Category = require('../models/Category');
const Collection = require('../models/Collection');
const Product = require('../models/Product');

async function seed() {
  const mongo = process.env.MONGO_URI;
  if (!mongo) {
    console.error('MONGO_URI not set in env');
    process.exit(1);
  }

  await mongoose.connect(mongo);
  console.log('Connected to MongoDB for seeding');

  // upsert categories
  const categories = [
    { name: 'Rings', slug: 'rings' },
    { name: 'Necklaces', slug: 'necklaces' },
    { name: 'Earrings', slug: 'earrings' },
    { name: 'Bracelets', slug: 'bracelets' },
  ];

  for (const c of categories) {
    await Category.findOneAndUpdate({ slug: c.slug }, c, { upsert: true, new: true });
  }

  const collections = [
    { name: 'Noir Collection', slug: 'noir', description: 'Mysterious elegance', featured: true, image_url: 'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg' },
    { name: 'Eternal Shine', slug: 'eternal-shine', description: 'Classic pieces', featured: true, image_url: 'https://images.pexels.com/photos/1454171/pexels-photo-1454171.jpeg' },
  ];

  for (const col of collections) {
    await Collection.findOneAndUpdate({ slug: col.slug }, col, { upsert: true, new: true });
  }

  // fetch some category/collection ids
  const earringCat = await Category.findOne({ slug: 'earrings' });
  const necklacesCat = await Category.findOne({ slug: 'necklaces' });
  const noirCol = await Collection.findOne({ slug: 'noir' });

  const products = [
    {
      name: 'Shadow Pearl Earrings',
      slug: 'shadow-pearl-earrings',
      description: 'Tahitian black pearls suspended in hand-crafted silver settings.',
      price: 1299.0,
      category_id: earringCat?._id,
      images: ['https://images.pexels.com/photos/1454172/pexels-photo-1454172.jpeg'],
      materials: ['Sterling Silver', 'Tahitian Pearl'],
      featured: true,
      in_stock: true,
    },
    {
      name: 'Obsidian Tear Necklace',
      slug: 'obsidian-tear-necklace',
      description: 'An elegant pendant featuring a teardrop obsidian stone in a platinum setting.',
      price: 1899.0,
      category_id: necklacesCat?._id,
      images: ['https://images.pexels.com/photos/1454171/pexels-photo-1454171.jpeg'],
      materials: ['Platinum', 'Obsidian'],
      featured: true,
      in_stock: true,
    },
  ];

  for (const p of products) {
    await Product.findOneAndUpdate({ slug: p.slug }, p, { upsert: true, new: true });
  }

  console.log('Seed complete');
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});

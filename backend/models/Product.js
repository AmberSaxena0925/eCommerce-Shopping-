const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, trim: true },
  description: { type: String, default: '' },
  price: { type: Number, required: true, default: 0 },
  category_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  collection_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Collection', default: null },
  images: { type: [String], default: [] },
  materials: { type: [String], default: [] },
  in_stock: { type: Boolean, default: true },
  featured: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);

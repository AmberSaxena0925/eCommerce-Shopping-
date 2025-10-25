const mongoose = require('mongoose');

const collectionSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, trim: true },
  description: { type: String, default: '' },
  image_url: { type: String, default: '' },
  featured: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Collection', collectionSchema);

const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  price: { type: Number, required: true },
  description: { type: String, default: '' },
  category: { type: String, required: true, enum: ['eyeglass', 'sunglasses', 'blue light', 'sports', 'transitions'] },
  frameShape: { type: String, required: true, enum: ['square', 'rectangle', 'round', 'cat-eye', 'browline', 'aviator'] },
  colors: [{ name: String, hex: String }],
  stock: [{ color: String, quantity: { type: Number, default: 0 } }],
  lowStockThreshold: { type: Number, default: 5 },
  compatibleLenses: [{ type: String }],
  faceShapes: [{ type: String }],
  image: { type: String, default: '' },
  inStock: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  storeName: { type: String, default: 'VisionFit' },
  contactEmail: { type: String, default: 'support@visionfit.com' },
  currency: { type: String, default: '₱' },
  shippingFee: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Settings', settingsSchema);

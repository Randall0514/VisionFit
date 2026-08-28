const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name: String,
  color: String,
  lensType: String,
  price: Number,
  quantity: { type: Number, default: 1 }
});

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [orderItemSchema],
  totalPrice: { type: Number, required: true },
  status: { type: String, enum: ['unpaid', 'processing', 'shipped', 'delivered'], default: 'unpaid' },
  deliveryDetails: {
    fullName: String,
    address: String,
    mobile: String
  }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
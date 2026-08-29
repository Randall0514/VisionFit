const express = require('express');
const Product = require('../models/Product');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/admin');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { category, frameShape, minPrice, maxPrice, search } = req.query;
    const filter = {};

    if (category) filter.category = category;
    if (frameShape) filter.frameShape = frameShape;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', adminAuth, async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ error: error.message || 'Server error' });
  }
});

router.put('/:id', adminAuth, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.patch('/:id/stock', adminAuth, async (req, res) => {
  try {
    const { stock, lowStockThreshold } = req.body;
    const update = {};
    if (stock) update.stock = stock;
    if (lowStockThreshold !== undefined) update.lowStockThreshold = lowStockThreshold;

    const product = await Product.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    console.error('Update stock error:', error);
    res.status(500).json({ error: error.message || 'Server error' });
  }
});

router.get('/admin/low-stock', adminAuth, async (req, res) => {
  try {
    const threshold = Number(req.query.threshold) || 5;
    const products = await Product.find({
      'stock': { $elemMatch: { quantity: { $lte: threshold } } }
    }).sort({ createdAt: -1 });

    const lowStock = products.map(p => ({
      _id: p._id,
      name: p.name,
      image: p.image,
      category: p.category,
      colors: p.colors,
      stock: p.stock.filter(s => s.quantity <= threshold),
      lowStockThreshold: threshold,
    }));

    res.json(lowStock);
  } catch (error) {
    console.error('Low stock error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;

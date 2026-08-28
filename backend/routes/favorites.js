const express = require('express');
const Favorite = require('../models/Favorite');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const favorites = await Favorite.find({ user: req.user._id })
      .populate('product')
      .sort({ createdAt: -1 });
    res.json(favorites);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/:productId', auth, async (req, res) => {
  try {
    const favorite = new Favorite({
      user: req.user._id,
      product: req.params.productId
    });
    await favorite.save();
    res.status(201).json({ message: 'Added to favorites' });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Already in favorites' });
    }
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/:productId', auth, async (req, res) => {
  try {
    await Favorite.findOneAndDelete({
      user: req.user._id,
      product: req.params.productId
    });
    res.json({ message: 'Removed from favorites' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
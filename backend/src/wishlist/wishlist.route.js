const express = require('express');
const Wishlist = require('./wishlist.model');
const router = express.Router();

router.get('/:userId', async (req, res) => {
  try {
    const wishlist = await Wishlist.find({ userId: req.params.userId }).populate('bookId');
    res.status(200).json(wishlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { userId, bookId } = req.body;
    const existing = await Wishlist.findOne({ userId, bookId });
    if (existing) {
      return res.status(400).json({ message: 'Book already in wishlist' });
    }
    const wishlistItem = new Wishlist({ userId, bookId });
    await wishlistItem.save();
    res.status(201).json(wishlistItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:userId/:bookId', async (req, res) => {
  try {
    await Wishlist.findOneAndDelete({ 
      userId: req.params.userId, 
      bookId: req.params.bookId 
    });
    res.status(200).json({ message: 'Removed from wishlist' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

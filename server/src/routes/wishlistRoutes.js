const express = require('express');
const router = express.Router();

const wishlistController = require('../controllers/wishlistController');
const getWishlist = wishlistController.getWishlist;
const addToWishlist = wishlistController.addToWishlist;
const removeFromWishlist = wishlistController.removeFromWishlist;

const authMiddleware = require('../middlewares/auth');
const isLoggedIn = authMiddleware.isLoggedIn || authMiddleware;

// GET /api/wishlist
router.get('/', isLoggedIn, getWishlist);

// POST /api/wishlist/:listingId
router.post('/:listingId', isLoggedIn, addToWishlist);

// DELETE /api/wishlist/:listingId
router.delete('/:listingId', isLoggedIn, removeFromWishlist);

module.exports = router;
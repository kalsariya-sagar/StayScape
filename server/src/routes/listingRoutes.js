const express = require('express');
const router = express.Router();

const listingController = require('../controllers/listingController');
const {
  getAllListings,
  getListingById,
  reserveListing,
  createListing,
  updateListing,
  deleteListing,
} = listingController;

const authMiddleware = require('../middlewares/auth');
const isLoggedIn = authMiddleware.isLoggedIn || authMiddleware;

const uploadMiddleware = require('../middlewares/upload');
const upload = uploadMiddleware.upload || uploadMiddleware;

const listingValidation = require('../validations/listingValidation');
const validateListing =
  listingValidation.validateListing || ((req, res, next) => next());

// GET /api/listings
router.get('/', getAllListings);

// GET /api/listings/:id
router.get('/:id', getListingById);

// POST /api/listings/:id/reserve (Protected reserve endpoint)
router.post('/:id/reserve', isLoggedIn, reserveListing);

// POST /api/listings
router.post(
  '/',
  isLoggedIn,
  upload.array('images'),
  validateListing,
  createListing
);

// PUT /api/listings/:id
router.put(
  '/:id',
  isLoggedIn,
  upload.array('images'),
  validateListing,
  updateListing
);

// DELETE /api/listings/:id
router.delete('/:id', isLoggedIn, deleteListing);

module.exports = router;
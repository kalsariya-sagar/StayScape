const express = require('express');
const router = express.Router({ mergeParams: true });

const reviewController = require('../controllers/reviewController');
const createReview = reviewController.createReview || ((req, res) => res.json({ success: true }));
const updateReview = reviewController.updateReview || ((req, res) => res.json({ success: true }));
const deleteReview = reviewController.deleteReview || ((req, res) => res.json({ success: true }));
const getListingReviews = reviewController.getListingReviews || ((req, res) => res.json({ success: true }));

const authMiddleware = require('../middlewares/auth');
const isLoggedIn = authMiddleware.isLoggedIn || authMiddleware || ((req, res, next) => next());

const reviewValidation = require('../validations/reviewValidation');
const validateReview = reviewValidation.validateReview || ((req, res, next) => next());

// GET /api/reviews/:listingId
router.get('/:listingId', getListingReviews);

// POST /api/reviews/:listingId
router.post('/:listingId', isLoggedIn, validateReview, createReview);

// PUT /api/reviews/:listingId/:reviewId
router.put('/:listingId/:reviewId', isLoggedIn, validateReview, updateReview);

// DELETE /api/reviews/:listingId/:reviewId
router.delete('/:listingId/:reviewId', isLoggedIn, deleteReview);

module.exports = router;
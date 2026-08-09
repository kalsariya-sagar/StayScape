const Listing = require('../models/Listing');
const Review = require('../models/Review');

// Helper to recalculate and update listing average rating
const updateListingRating = async (listingId) => {
  const listing = await Listing.findById(listingId).populate('reviews');
  if (!listing) return;

  if (listing.reviews && listing.reviews.length > 0) {
    const total = listing.reviews.reduce((acc, rev) => acc + (rev.rating || 0), 0);
    listing.averageRating = Number((total / listing.reviews.length).toFixed(1));
  } else {
    listing.averageRating = 0;
  }
  await listing.save();
};

// Create a review for a listing
exports.createReview = async (req, res, next) => {
  try {
    const { listingId } = req.params;
    const { rating, comment } = req.body;

    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({ success: false, message: 'Listing not found' });
    }

    const review = new Review({
      rating: Number(rating),
      comment,
      author: req.user._id,
      listing: listingId,
    });

    await review.save();

    listing.reviews.push(review._id);
    await listing.save();

    await updateListingRating(listingId);

    const populatedReview = await Review.findById(review._id).populate(
      'author',
      'username firstName lastName'
    );

    res.status(201).json({
      success: true,
      data: populatedReview,
    });
  } catch (err) {
    next(err);
  }
};

// Update an existing review
exports.updateReview = async (req, res, next) => {
  try {
    const { reviewId } = req.params;
    const { rating, comment } = req.body;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    if (review.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to edit this review' });
    }

    if (rating !== undefined) review.rating = Number(rating);
    if (comment !== undefined) review.comment = comment;

    await review.save();
    await updateListingRating(review.listing);

    res.status(200).json({
      success: true,
      data: review,
    });
  } catch (err) {
    next(err);
  }
};

// Delete a review
exports.deleteReview = async (req, res, next) => {
  try {
    const { listingId, reviewId } = req.params;
    const targetReviewId = reviewId || req.params.id;

    const review = await Review.findById(targetReviewId);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    if (review.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this review' });
    }

    const parentListingId = listingId || review.listing;

    await Review.findByIdAndDelete(targetReviewId);

    if (parentListingId) {
      await Listing.findByIdAndUpdate(parentListingId, {
        $pull: { reviews: targetReviewId },
      });
      await updateListingRating(parentListingId);
    }

    res.status(200).json({
      success: true,
      message: 'Review deleted successfully',
    });
  } catch (err) {
    next(err);
  }
};

// Get all reviews for a listing
exports.getListingReviews = async (req, res, next) => {
  try {
    const { listingId } = req.params;
    const reviews = await Review.find({ listing: listingId })
      .populate('author', 'username firstName lastName')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createReview: exports.createReview,
  updateReview: exports.updateReview,
  deleteReview: exports.deleteReview,
  getListingReviews: exports.getListingReviews,
};
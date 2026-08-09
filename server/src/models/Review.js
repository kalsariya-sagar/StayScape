const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    comment: {
      type: String,
      required: [true, 'Review comment is required'],
      trim: true,
      minlength: [3, 'Comment must be at least 3 characters long'],
      maxlength: [1000, 'Comment cannot exceed 1000 characters'],
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot be more than 5'],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Review author is required'],
    },
    listing: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Listing',
      required: [true, 'Target listing is required'],
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate reviews from the same user for a single listing
reviewSchema.index({ listing: 1, author: 1 }, { unique: true });

/**
 * Static method to calculate and update average rating and total review count on Listing
 * @param {ObjectId} listingId - ID of the listing being reviewed
 */
reviewSchema.statics.calcAverageRating = async function (listingId) {
  const stats = await this.aggregate([
    {
      $match: { listing: listingId },
    },
    {
      $group: {
        _id: '$listing',
        numReviews: { $sum: 1 },
        averageRating: { $avg: '$rating' },
      },
    },
  ]);

  const Listing = mongoose.model('Listing');

  if (stats.length > 0) {
    await Listing.findByIdAndUpdate(listingId, {
      numReviews: stats[0].numReviews,
      averageRating: Math.round(stats[0].averageRating * 10) / 10,
    });
  } else {
    await Listing.findByIdAndUpdate(listingId, {
      numReviews: 0,
      averageRating: 0,
    });
  }
};

// Calculate average rating after a new review is saved
reviewSchema.post('save', async function () {
  await this.constructor.calcAverageRating(this.listing);
});

// Calculate average rating after a review is deleted or updated
reviewSchema.post(/^findOneAnd/, async function (doc) {
  if (doc) {
    await doc.constructor.calcAverageRating(doc.listing);
  }
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
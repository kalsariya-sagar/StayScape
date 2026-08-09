import React, { useState } from 'react';
import { Star } from 'lucide-react';

const ReviewForm = ({ onSubmit, isSubmitting }) => {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating || rating < 1) {
      setError('Please select a star rating.');
      return;
    }
    if (!comment.trim()) {
      setError('Please write a comment for your review.');
      return;
    }

    try {
      setError('');
      await onSubmit({ rating, comment: comment.trim() });
      setComment('');
      setRating(5);
    } catch (err) {
      setError(err.message || 'Failed to submit review.');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-50 border border-gray-200 rounded-3xl p-6 mb-8 space-y-4"
    >
      <h3 className="text-lg font-bold text-gray-900">Write a Review</h3>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl">
          {error}
        </div>
      )}

      <div>
        <label className="block text-xs font-semibold uppercase text-gray-700 mb-1">
          Rating
        </label>
        <div className="flex items-center space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              type="button"
              key={star}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="p-1 focus:outline-none transition-transform hover:scale-110"
            >
              <Star
                className={`w-6 h-6 ${
                  (hoverRating || rating) >= star
                    ? 'fill-amber-400 text-amber-400'
                    : 'text-gray-300'
                }`}
              />
            </button>
          ))}
          <span className="ml-2 text-sm font-semibold text-gray-700">
            {rating} / 5
          </span>
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase text-gray-700 mb-1">
          Your Review
        </label>
        <textarea
          rows="3"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share details of your stay, cleanliness, location, or communication..."
          className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
        ></textarea>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-brand-500 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-brand-600 transition-colors disabled:opacity-50"
      >
        {isSubmitting ? 'Submitting Review...' : 'Submit Review'}
      </button>
    </form>
  );
};

export default ReviewForm;
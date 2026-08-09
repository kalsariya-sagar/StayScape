import React from 'react';
import { Star, Trash2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Avatar from '../common/Avatar';

const ReviewList = ({ reviews = [], onDeleteReview, isDeleting }) => {
  const { user } = useAuth();

  if (!reviews || reviews.length === 0) {
    return (
      <div className="py-6 text-gray-500 text-sm italic">
        No reviews yet. Be the first guest to leave a review!
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
      {reviews.map((review) => {
        const isAuthor =
          user &&
          (review.author?._id === user._id ||
            review.author?._id === user.id ||
            review.author === user._id);

        const authorName = review.author?.firstName
          ? `${review.author.firstName} ${review.author.lastName || ''}`
          : review.author?.username || 'Guest';

        const reviewDate = review.createdAt
          ? new Date(review.createdAt).toLocaleDateString('en-US', {
              month: 'long',
              year: 'numeric',
            })
          : '';

        return (
          <div
            key={review._id}
            className="p-4 border border-gray-100 rounded-2xl bg-gray-50/50 flex flex-col justify-between"
          >
            <div>
              {/* Reviewer Info & Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Avatar user={review.author} size="md" />
                  <div>
                    <h4 className="font-semibold text-sm text-gray-900">{authorName}</h4>
                    <p className="text-xs text-gray-400">{reviewDate}</p>
                  </div>
                </div>

                {/* Rating Badge */}
                <div className="flex items-center gap-1 bg-white border border-gray-200 px-2 py-1 rounded-full text-xs font-semibold">
                  <Star className="w-3.5 h-3.5 fill-black text-black" />
                  <span>{review.rating}</span>
                </div>
              </div>

              {/* Review Text */}
              <p className="text-sm text-gray-700 leading-relaxed font-light">
                {review.comment}
              </p>
            </div>

            {/* Actions */}
            {isAuthor && onDeleteReview && (
              <div className="mt-4 pt-3 border-t border-gray-200/60 flex justify-end">
                <button
                  onClick={() => onDeleteReview(review._id)}
                  disabled={isDeleting}
                  className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 font-medium transition-colors disabled:opacity-50"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ReviewList;
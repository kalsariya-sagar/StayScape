import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ListingGrid from '../components/listings/ListingGrid';
import { wishlistService } from '../services/wishlistService';
import { Heart, ArrowLeft } from 'lucide-react';

const WishlistPage = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await wishlistService.getWishlist();
      const data = response.data || response;
      setWishlistItems(Array.isArray(data) ? data : data.wishlist || []);
    } catch (err) {
      console.error('Error fetching wishlist:', err);
      setError(err.message || 'Failed to load your wishlist.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const handleWishlistToggle = (listingId, isSaved) => {
    if (!isSaved) {
      setWishlistItems((prev) => prev.filter((item) => item._id !== listingId));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Top Header Navigation */}
      <div className="mb-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-gray-900 mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Explore</span>
        </Link>
        <div className="flex items-center gap-3">
          <div className="bg-brand-50 p-3 rounded-2xl text-brand-500">
            <Heart className="w-8 h-8 fill-brand-500" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Wishlists</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {wishlistItems.length} {wishlistItems.length === 1 ? 'saved stay' : 'saved stays'}
            </p>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-8 p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl">
          {error}
        </div>
      )}

      {/* Wishlist Grid or Empty State */}
      {!loading && wishlistItems.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 border border-gray-200 rounded-3xl max-w-lg mx-auto px-6">
          <div className="bg-white p-4 rounded-full inline-block shadow-sm mb-4">
            <Heart className="w-8 h-8 text-gray-400" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Your wishlist is empty</h2>
          <p className="text-gray-500 text-sm mb-6">
            As you search, click the heart icon on any stay to save your favorite spots here for later.
          </p>
          <Link
            to="/"
            className="inline-flex items-center justify-center bg-brand-500 text-white font-bold px-6 py-3 rounded-xl hover:bg-brand-600 transition-colors shadow-md text-sm"
          >
            Start Exploring
          </Link>
        </div>
      ) : (
        <ListingGrid
          listings={wishlistItems}
          loading={loading}
          onWishlistToggle={handleWishlistToggle}
        />
      )}
    </div>
  );
};

export default WishlistPage;
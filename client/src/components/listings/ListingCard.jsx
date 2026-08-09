import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { wishlistService } from '../../services/wishlistService';

const ListingCard = ({ listing, isWishlisted = false, onWishlistToggle }) => {
  const { isAuthenticated, user, refreshUser } = useAuth();
  const navigate = useNavigate();

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [inWishlist, setInWishlist] = useState(
    isWishlisted || (user?.wishlist && user.wishlist.includes(listing._id))
  );
  const [loadingWishlist, setLoadingWishlist] = useState(false);

  const images = listing.images && listing.images.length > 0
    ? listing.images
    : [{ url: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=1200&auto=format&fit=crop' }];

  const handlePrevImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleWishlistClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      setLoadingWishlist(true);
      if (inWishlist) {
        await wishlistService.removeFromWishlist(listing._id);
        setInWishlist(false);
      } else {
        await wishlistService.addToWishlist(listing._id);
        setInWishlist(true);
      }
      if (onWishlistToggle) {
        onWishlistToggle(listing._id, !inWishlist);
      }
      await refreshUser();
    } catch (err) {
      console.error('Error toggling wishlist:', err);
    } finally {
      setLoadingWishlist(false);
    }
  };

  return (
    <div className="group relative flex flex-col cursor-pointer">
      {/* Image Carousel / Container */}
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-gray-100">
        <Link to={`/listings/${listing._id}`} className="block w-full h-full">
          <img
            src={images[currentImageIndex].url}
            alt={listing.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </Link>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistClick}
          disabled={loadingWishlist}
          className="absolute top-3 right-3 z-10 p-2 rounded-full transition hover:scale-110 active:scale-90 text-white focus:outline-none"
          aria-label="Add to Wishlist"
        >
          <Heart
            className={`w-6 h-6 transition-colors ${
              inWishlist
                ? 'fill-brand-500 text-brand-500'
                : 'fill-black/40 text-white stroke-[2]'
            }`}
          />
        </button>

        {/* Image Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/80 text-gray-800 shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/80 text-gray-800 shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Pagination Indicators */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center space-x-1 z-10">
              {images.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-1.5 rounded-full transition-all ${
                    idx === currentImageIndex ? 'w-4 bg-white' : 'w-1.5 bg-white/60'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Listing Details */}
      <Link to={`/listings/${listing._id}`} className="mt-3 flex flex-col space-y-1">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900 truncate pr-2">
            {listing.city ? `${listing.city}, ${listing.country}` : listing.location}
          </h3>
          <div className="flex items-center space-x-1 flex-shrink-0 text-sm font-light">
            <Star className="w-4 h-4 text-black fill-black" />
            <span>{listing.averageRating ? listing.averageRating.toFixed(1) : 'New'}</span>
          </div>
        </div>

        <p className="text-sm text-gray-500 truncate">{listing.title}</p>
        <p className="text-sm text-gray-500">{listing.category || 'Vacation Home'}</p>

        <div className="pt-1 flex items-baseline space-x-1">
          <span className="font-semibold text-gray-900">${listing.price}</span>
          <span className="text-sm text-gray-600">night</span>
        </div>
      </Link>
    </div>
  );
};

export default ListingCard;
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Star,
  Heart,
  MapPin,
  Home,
  ShieldCheck,
  Sparkles,
  ChevronLeft,
  Trash2,
  Edit,
  Wifi,
  Tv,
  Car,
  AirVent,
  Utensils,
  LogIn,
  AlertCircle,
} from 'lucide-react';
import { listingService } from '../services/listingService';
import { reviewService } from '../services/reviewService';
import { wishlistService } from '../services/wishlistService';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import ReviewList from '../components/reviews/ReviewList';
import ReviewForm from '../components/reviews/ReviewForm';
import MapView from '../components/listings/MapView';
import Avatar from '../components/common/Avatar';

const AMENITY_ICONS = {
  WiFi: Wifi,
  TV: Tv,
  Parking: Car,
  'Air Conditioning': AirVent,
  Kitchen: Utensils,
};

const ListingDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, refreshUser } = useAuth();

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isDeletingListing, setIsDeletingListing] = useState(false);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [isDeletingReview, setIsDeletingReview] = useState(false);
  const [isReserving, setIsReserving] = useState(false);
  const [reserveMessage, setReserveMessage] = useState('');

  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);

  const fetchListing = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await listingService.getListingById(id);
      const listingData = data.data || data;
      setListing(listingData);

      if (user?.wishlist) {
        setIsWishlisted(
          user.wishlist.some(
            (item) => (typeof item === 'string' ? item : item._id) === id
          )
        );
      }
    } catch (err) {
      console.error('Error fetching listing details:', err);
      setError(err.message || 'Failed to load listing details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListing();
  }, [id, user]);

  const handleWishlistToggle = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      if (isWishlisted) {
        await wishlistService.removeFromWishlist(id);
        setIsWishlisted(false);
      } else {
        await wishlistService.addToWishlist(id);
        setIsWishlisted(true);
      }
      await refreshUser();
    } catch (err) {
      console.error('Wishlist toggle error:', err);
    }
  };

  const handleReserve = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      setIsReserving(true);
      setReserveMessage('');
      const res = await api.post(`/listings/${id}/reserve`, {
        checkIn,
        checkOut,
        guests,
      });
      setReserveMessage(res.data?.message || 'Reservation successful!');
    } catch (err) {
      setReserveMessage(err.response?.data?.message || err.message || 'Reservation failed.');
    } finally {
      setIsReserving(false);
    }
  };

  const handleDeleteListing = async () => {
    if (!window.confirm('Are you sure you want to delete this listing permanently?')) {
      return;
    }

    try {
      setIsDeletingListing(true);
      await listingService.deleteListing(id);
      navigate('/');
    } catch (err) {
      alert(err.message || 'Failed to delete listing.');
      setIsDeletingListing(false);
    }
  };

  const handleAddReview = async (reviewData) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      setIsSubmittingReview(true);
      await reviewService.createReview(id, reviewData);
      await fetchListing();
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete your review?')) {
      return;
    }

    try {
      setIsDeletingReview(true);
      await reviewService.deleteReview(id, reviewId);
      await fetchListing();
    } catch (err) {
      alert(err.message || 'Failed to delete review.');
    } finally {
      setIsDeletingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse space-y-6">
        <div className="h-8 bg-gray-200 rounded w-1/2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        <div className="h-96 bg-gray-200 rounded-3xl w-full"></div>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {error || 'Listing not found'}
        </h2>
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-brand-500 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-brand-600 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
      </div>
    );
  }

  const ownerId =
    typeof listing.owner === 'object'
      ? listing.owner?._id || listing.owner?.id
      : listing.owner;
  const currentUserId = user?._id || user?.id;
  const isOwner = Boolean(
    currentUserId && ownerId && String(ownerId) === String(currentUserId)
  );

  const images =
    listing.images && listing.images.length > 0
      ? listing.images
      : [
          {
            url: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=1200&auto=format&fit=crop',
          },
        ];

  const hostName = listing.owner?.firstName
    ? `${listing.owner.firstName} ${listing.owner.lastName || ''}`
    : listing.owner?.username || 'Sagar Kalsariya';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Title & Top Bar */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          {listing.title}
        </h1>
        <div className="flex flex-wrap items-center justify-between gap-4 text-sm">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1 font-semibold">
              <Star className="w-4 h-4 fill-black text-black" />
              <span>
                {listing.averageRating ? listing.averageRating.toFixed(1) : 'New'}
              </span>
              <span className="text-gray-400">·</span>
              <span className="underline">{listing.reviews?.length || 0} reviews</span>
            </div>
            <div className="flex items-center space-x-1 text-gray-600">
              <MapPin className="w-4 h-4" />
              <span>{listing.location}</span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleWishlistToggle}
              className="flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors"
            >
              <Heart
                className={`w-4 h-4 ${
                  isWishlisted ? 'fill-brand-500 text-brand-500' : 'text-gray-700'
                }`}
              />
              <span>{isWishlisted ? 'Saved' : 'Save'}</span>
            </button>

            {isOwner && (
              <>
                <Link
                  to={`/listings/${listing._id}/edit`}
                  className="flex items-center gap-1.5 bg-gray-100 text-gray-800 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-gray-200 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  <span>Edit</span>
                </Link>
                <button
                  onClick={handleDeleteListing}
                  disabled={isDeletingListing}
                  className="flex items-center gap-1.5 bg-red-50 text-red-600 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-red-100 transition-colors disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 rounded-3xl overflow-hidden mb-12 shadow-sm">
        <div className="md:col-span-2 aspect-square md:aspect-auto h-full min-h-[300px]">
          <img
            src={images[0].url}
            alt={listing.title}
            className="w-full h-full object-cover hover:opacity-95 transition-opacity cursor-pointer"
          />
        </div>
        <div className="hidden md:grid md:col-span-2 grid-cols-2 gap-3">
          {images.slice(1, 5).map((img, idx) => (
            <div key={idx} className="aspect-square">
              <img
                src={img.url}
                alt={`${listing.title} ${idx + 2}`}
                className="w-full h-full object-cover hover:opacity-95 transition-opacity cursor-pointer"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-12">
        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-center justify-between pb-6 border-b border-gray-200">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Hosted by {hostName}
              </h2>
              <p className="text-sm text-gray-500">
                {listing.category || 'Entire home'} · {listing.location}
              </p>
            </div>
            <Avatar user={listing.owner} size="lg" />
          </div>

          <div className="space-y-4 pb-6 border-b border-gray-200">
            <div className="flex items-start space-x-4">
              <Home className="w-6 h-6 text-gray-700 mt-1" />
              <div>
                <h4 className="font-semibold text-gray-900">Self check-in</h4>
                <p className="text-sm text-gray-500">Check yourself in with the smart lock.</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <Sparkles className="w-6 h-6 text-gray-700 mt-1" />
              <div>
                <h4 className="font-semibold text-gray-900">Experienced host</h4>
                <p className="text-sm text-gray-500">{hostName} has great reviews for hospitality.</p>
              </div>
            </div>
          </div>

          <div className="pb-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">About this space</h3>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line font-light">
              {listing.description}
            </p>
          </div>

          {listing.amenities && listing.amenities.length > 0 && (
            <div className="pb-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">What this place offers</h3>
              <div className="grid grid-cols-2 gap-4">
                {listing.amenities.map((amenity, idx) => {
                  const Icon = AMENITY_ICONS[amenity] || ShieldCheck;
                  return (
                    <div key={idx} className="flex items-center space-x-3 text-gray-700">
                      <Icon className="w-5 h-5 text-gray-600" />
                      <span className="text-sm">{amenity}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Reservation Card */}
        <div className="lg:col-span-1">
          <div className="sticky top-28 bg-white border border-gray-200 rounded-3xl p-6 shadow-xl">
            <div className="flex items-baseline justify-between mb-6">
              <div>
                <span className="text-2xl font-bold text-gray-900">${listing.price}</span>
                <span className="text-gray-500 text-sm"> / night</span>
              </div>
              <div className="flex items-center space-x-1 text-sm font-semibold">
                <Star className="w-4 h-4 fill-black text-black" />
                <span>{listing.averageRating ? listing.averageRating.toFixed(1) : 'New'}</span>
              </div>
            </div>

            {isOwner ? (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-center space-y-1">
                <div className="flex items-center justify-center gap-1.5 text-amber-800 font-bold text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>Your listing</span>
                </div>
                <p className="text-xs text-amber-700">
                  You can't reserve your own property.
                </p>
              </div>
            ) : (
              <>
                <div className="border border-gray-300 rounded-2xl overflow-hidden mb-4 text-xs">
                  <div className="grid grid-cols-2 border-b border-gray-300">
                    <div className="p-3 border-r border-gray-300">
                      <label className="block font-bold uppercase text-gray-700">Check-In</label>
                      <input
                        type="date"
                        value={checkIn}
                        onChange={(e) => setCheckIn(e.target.value)}
                        className="w-full mt-1 text-gray-800 bg-transparent focus:outline-none"
                      />
                    </div>
                    <div className="p-3">
                      <label className="block font-bold uppercase text-gray-700">Checkout</label>
                      <input
                        type="date"
                        value={checkOut}
                        onChange={(e) => setCheckOut(e.target.value)}
                        className="w-full mt-1 text-gray-800 bg-transparent focus:outline-none"
                      />
                    </div>
                  </div>
                  <div className="p-3">
                    <label className="block font-bold uppercase text-gray-700">Guests</label>
                    <select
                      value={guests}
                      onChange={(e) => setGuests(Number(e.target.value))}
                      className="w-full mt-1 bg-transparent text-gray-800 focus:outline-none"
                    >
                      <option value={1}>1 guest</option>
                      <option value={2}>2 guests</option>
                      <option value={3}>3 guests</option>
                      <option value={4}>4+ guests</option>
                    </select>
                  </div>
                </div>

                <button
                  onClick={handleReserve}
                  disabled={isReserving}
                  className="w-full bg-brand-500 text-white py-3.5 rounded-xl font-bold hover:bg-brand-600 transition-colors shadow-md disabled:opacity-50"
                >
                  {isReserving ? 'Processing...' : 'Reserve'}
                </button>

                {reserveMessage && (
                  <p className="text-center text-xs font-semibold text-emerald-600 mt-3">
                    {reserveMessage}
                  </p>
                )}

                <p className="text-center text-xs text-gray-500 mt-3">
                  You won't be charged yet
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="my-12 pt-8 border-t border-gray-200">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Where you'll be</h3>
        <p className="text-sm text-gray-600 mb-6">{listing.location}</p>
        <div className="h-96 rounded-3xl overflow-hidden">
          <MapView listings={[listing]} selectedListing={listing} />
        </div>
      </div>

      {/* Reviews Section */}
      <div className="my-12 pt-8 border-t border-gray-200">
        <div className="flex items-center space-x-2 text-xl font-bold text-gray-900 mb-6">
          <Star className="w-6 h-6 fill-black text-black" />
          <span>
            {listing.averageRating ? listing.averageRating.toFixed(1) : 'New'} ·{' '}
            {listing.reviews?.length || 0} reviews
          </span>
        </div>

        {!isAuthenticated ? (
          <div className="bg-gray-50 border border-gray-200 rounded-3xl p-6 mb-8 text-center flex flex-col items-center justify-center">
            <p className="text-gray-700 text-sm font-medium mb-3">
              Have you stayed here? Log in to leave a review.
            </p>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 bg-brand-500 text-white font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-brand-600 transition-colors shadow-sm"
            >
              <LogIn className="w-4 h-4" />
              <span>Log in to write a review</span>
            </Link>
          </div>
        ) : isOwner ? (
          <div className="bg-gray-50 border border-gray-200/80 rounded-2xl p-4 mb-8 text-sm text-gray-500 italic">
            You are the host of this property and cannot leave a review for your own listing.
          </div>
        ) : (
          <ReviewForm onSubmit={handleAddReview} isSubmitting={isSubmittingReview} />
        )}

        <ReviewList
          reviews={listing.reviews}
          onDeleteReview={handleDeleteReview}
          isDeleting={isDeletingReview}
        />
      </div>
    </div>
  );
};

export default ListingDetailsPage;
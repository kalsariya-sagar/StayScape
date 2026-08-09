import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import CategoryFilter from '../components/common/CategoryFilter';
import ListingGrid from '../components/listings/ListingGrid';
import MapView from '../components/listings/MapView';
import { listingService } from '../services/listingService';
import { Map, Grid, RefreshCw } from 'lucide-react';

const HomePage = () => {
  const [searchParams] = useSearchParams();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showMap, setShowMap] = useState(false);
  const [selectedListing, setSelectedListing] = useState(null);

  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';

  const fetchListings = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {};
      if (search) params.search = search;
      if (category && category !== 'All') params.category = category;

      const response = await listingService.getAllListings(params);
      const data = response.data || response;
      
      setListings(Array.isArray(data) ? data : data.listings || []);
    } catch (err) {
      console.error('Error fetching listings:', err);
      setError(err.message || 'Failed to load listings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, [search, category]);

  const handleWishlistToggle = (listingId, isSaved) => {
    // Optionally update local list state or leave sync to context
  };

  return (
    <div className="min-h-screen pb-16">
      {/* Category Navigation Bar */}
      <CategoryFilter />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header / Active Filter Info */}
        {(search || category) && (
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-900">
              {search ? (
                <>
                  Stays in <span className="capitalize">"{search}"</span>
                </>
              ) : (
                `${category} Stays`
              )}
            </h1>
            <p className="text-sm text-gray-500">
              {listings.length} {listings.length === 1 ? 'place' : 'places'} found
            </p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="my-8 p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl flex items-center justify-between">
            <p>{error}</p>
            <button
              onClick={fetchListings}
              className="flex items-center gap-1 font-semibold hover:underline"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Retry</span>
            </button>
          </div>
        )}

        {/* Dynamic View: Map Split / Full Grid */}
        {showMap ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-220px)] min-h-[500px]">
            <div className="lg:col-span-7 h-full overflow-y-auto pr-2">
              <ListingGrid
                listings={listings}
                loading={loading}
                onWishlistToggle={handleWishlistToggle}
              />
            </div>
            <div className="lg:col-span-5 h-full rounded-2xl overflow-hidden sticky top-28">
              <MapView
                listings={listings}
                selectedListing={selectedListing}
                onMarkerClick={(listing) => setSelectedListing(listing)}
              />
            </div>
          </div>
        ) : (
          <ListingGrid
            listings={listings}
            loading={loading}
            onWishlistToggle={handleWishlistToggle}
          />
        )}

        {/* Floating Map/Grid Toggle Button */}
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-30">
          <button
            onClick={() => setShowMap((prev) => !prev)}
            className="flex items-center gap-2 bg-gray-900 text-white font-semibold py-3 px-6 rounded-full shadow-2xl hover:bg-black hover:scale-105 active:scale-95 transition-all"
          >
            {showMap ? (
              <>
                <span>Show List</span>
                <Grid className="w-4 h-4" />
              </>
            ) : (
              <>
                <span>Show Map</span>
                <Map className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
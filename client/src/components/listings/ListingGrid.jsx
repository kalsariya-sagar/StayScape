import React from 'react';
import ListingCard from './ListingCard';
import { Home } from 'lucide-react';

const ListingGrid = ({ listings, loading, onWishlistToggle }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, idx) => (
          <div key={idx} className="animate-pulse flex flex-col space-y-3">
            <div className="bg-gray-200 aspect-square w-full rounded-2xl"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!listings || listings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <div className="bg-gray-100 p-4 rounded-full mb-4">
          <Home className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">
          No listings found
        </h3>
        <p className="text-gray-500 max-w-sm">
          Try adjusting your search criteria or explore different categories to find available stays.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {listings.map((listing) => (
        <ListingCard
          key={listing._id}
          listing={listing}
          onWishlistToggle={onWishlistToggle}
        />
      ))}
    </div>
  );
};

export default ListingGrid;
import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || '';

const MapView = ({ listings = [], selectedListing, onMarkerClick }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    if (!mapContainer.current || !MAPBOX_TOKEN) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;

    const defaultCenter =
      listings.length > 0 && listings[0].geometry?.coordinates
        ? listings[0].geometry.coordinates
        : [-73.935242, 40.73061];

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: defaultCenter,
      zoom: 10,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, []);

  useEffect(() => {
    if (!map.current || !MAPBOX_TOKEN) return;

    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    if (!listings || listings.length === 0) return;

    const bounds = new mapboxgl.LngLatBounds();

    listings.forEach((listing) => {
      const coords = listing.geometry?.coordinates;
      if (!coords || coords.length !== 2) return;

      const el = document.createElement('div');
      el.className =
        'price-marker bg-white text-gray-900 font-bold py-1 px-2.5 rounded-full shadow-md border border-gray-200 text-xs hover:scale-110 hover:bg-black hover:text-white transition-all cursor-pointer';
      el.innerText = `$${listing.price}`;

      if (selectedListing && selectedListing._id === listing._id) {
        el.className =
          'price-marker bg-black text-white font-bold py-1 px-2.5 rounded-full shadow-lg text-xs scale-110 transition-all cursor-pointer';
      }

      el.addEventListener('click', () => {
        if (onMarkerClick) {
          onMarkerClick(listing);
        }
      });

      const popupContent = `
        <div class="w-48 p-2">
          <img src="${listing.images?.[0]?.url || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6'}" alt="${listing.title}" class="w-full h-28 object-cover rounded-lg mb-2" />
          <h4 class="font-semibold text-sm text-gray-900 truncate">${listing.title}</h4>
          <p class="text-xs text-gray-500">${listing.city || ''}, ${listing.country || ''}</p>
          <p class="text-sm font-bold mt-1 text-gray-900">$${listing.price} <span class="font-normal text-xs text-gray-500">/ night</span></p>
        </div>
      `;

      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(popupContent);

      const marker = new mapboxgl.Marker(el)
        .setLngLat(coords)
        .setPopup(popup)
        .addTo(map.current);

      markersRef.current.push(marker);
      bounds.extend(coords);
    });

    if (listings.length > 0 && !bounds.isEmpty()) {
      map.current.fitBounds(bounds, { padding: 50, maxZoom: 14 });
    }
  }, [listings, selectedListing, onMarkerClick]);

  if (!MAPBOX_TOKEN) {
    return (
      <div className="w-full h-full min-h-[400px] bg-gray-100 rounded-2xl flex flex-col items-center justify-center p-6 text-center text-gray-500">
        <p className="font-semibold mb-1">Map Preview Unavailable</p>
        <p className="text-sm">Please set <code className="bg-gray-200 px-1 rounded">VITE_MAPBOX_TOKEN</code> in your environment configuration.</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full min-h-[400px] rounded-2xl overflow-hidden shadow-sm border border-gray-200">
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
};

export default MapView;
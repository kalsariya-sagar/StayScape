const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');

const mapboxToken = process.env.MAPBOX_ACCESS_TOKEN || process.env.MAPBOX_TOKEN;

// Lazy instantiation or conditional initialization to prevent startup crashes when token is absent
let geocodingClient = null;

if (mapboxToken) {
  geocodingClient = mbxGeocoding({ accessToken: mapboxToken });
} else {
  console.warn('Warning: MAPBOX_ACCESS_TOKEN is missing in environment variables. Mapbox geocoding services will be disabled.');
}

module.exports = geocodingClient;
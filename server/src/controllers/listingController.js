const Listing = require('../models/Listing');
const geocodingClient = require('../config/mapbox');

// Get all listings with optional search & category filter
exports.getAllListings = async (req, res, next) => {
  try {
    const { search, category } = req.query;
    const query = {};

    if (category && category !== 'All') {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
        { city: { $regex: search, $options: 'i' } },
        { country: { $regex: search, $options: 'i' } },
      ];
    }

    const listings = await Listing.find(query)
      .populate('owner', 'username firstName lastName email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: listings.length,
      data: listings,
    });
  } catch (err) {
    next(err);
  }
};

// Get single listing by ID
exports.getListingById = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id)
      .populate({
        path: 'reviews',
        populate: { path: 'author', select: 'username firstName lastName' },
      })
      .populate('owner', 'username firstName lastName email');

    if (!listing) {
      return res.status(404).json({ success: false, message: 'Listing not found' });
    }

    res.status(200).json({
      success: true,
      data: listing,
    });
  } catch (err) {
    next(err);
  }
};

// Reserve listing endpoint (Enforces owner restriction)
exports.reserveListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ success: false, message: 'Listing not found' });
    }

    const ownerId = listing.owner.toString();
    const currentUserId = req.user._id.toString();

    if (ownerId === currentUserId) {
      return res.status(403).json({
        success: false,
        message: "You can't reserve your own property.",
      });
    }

    const { checkIn, checkOut, guests } = req.body;

    if (!checkIn || !checkOut) {
      return res.status(400).json({
        success: false,
        message: 'Please select valid check-in and check-out dates.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Reservation confirmed successfully!',
      reservation: {
        listingId: listing._id,
        checkIn,
        checkOut,
        guests: Number(guests) || 1,
        totalPrice: listing.price,
      },
    });
  } catch (err) {
    next(err);
  }
};

// Create new listing
exports.createListing = async (req, res, next) => {
  try {
    const { title, description, price, location, city, country, category, amenities } = req.body;

    let geometry = {
      type: 'Point',
      coordinates: [-73.935242, 40.73061],
    };

    if (geocodingClient && location) {
      try {
        const geoData = await geocodingClient
          .forwardGeocode({
            query: location,
            limit: 1,
          })
          .send();

        if (geoData.body.features && geoData.body.features.length > 0) {
          geometry = geoData.body.features[0].geometry;
        }
      } catch (geoErr) {
        console.error('Geocoding failed, using default coordinates:', geoErr.message);
      }
    }

    let images = [];

    if (req.files && req.files.length > 0) {
      images = req.files.map((file) => ({
        url: file.path || file.secure_url || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6',
        filename: file.filename || file.public_id || 'uploaded_image',
      }));
    } else {
      images = [
        {
          url: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=1200&auto=format&fit=crop',
          filename: 'default_listing_image',
        },
      ];
    }

    const newListing = new Listing({
      title,
      description,
      price: Number(price),
      location,
      city,
      country,
      category,
      amenities: Array.isArray(amenities) ? amenities : amenities ? [amenities] : [],
      geometry,
      images,
      owner: req.user._id,
    });

    await newListing.save();

    res.status(201).json({
      success: true,
      data: newListing,
    });
  } catch (err) {
    next(err);
  }
};

// Update existing listing
exports.updateListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ success: false, message: 'Listing not found' });
    }

    if (listing.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to edit this listing' });
    }

    const { title, description, price, location, city, country, category, amenities, deletedImages } = req.body;

    if (title) listing.title = title;
    if (description) listing.description = description;
    if (price) listing.price = Number(price);
    if (category) listing.category = category;
    if (city !== undefined) listing.city = city;
    if (country !== undefined) listing.country = country;

    if (amenities) {
      listing.amenities = Array.isArray(amenities) ? amenities : [amenities];
    }

    if (location && location !== listing.location) {
      listing.location = location;
      if (geocodingClient) {
        try {
          const geoData = await geocodingClient
            .forwardGeocode({
              query: location,
              limit: 1,
            })
            .send();

          if (geoData.body.features && geoData.body.features.length > 0) {
            listing.geometry = geoData.body.features[0].geometry;
          }
        } catch (geoErr) {
          console.error('Geocoding update failed:', geoErr.message);
        }
      }
    }

    if (deletedImages) {
      const idsToDelete = Array.isArray(deletedImages) ? deletedImages : [deletedImages];
      listing.images = listing.images.filter((img) => !idsToDelete.includes(img._id.toString()));
    }

    if (req.files && req.files.length > 0) {
      const newImgs = req.files.map((file) => ({
        url: file.path || file.secure_url || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6',
        filename: file.filename || file.public_id || 'uploaded_image',
      }));
      listing.images.push(...newImgs);
    }

    await listing.save();

    res.status(200).json({
      success: true,
      data: listing,
    });
  } catch (err) {
    next(err);
  }
};

// Delete listing
exports.deleteListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ success: false, message: 'Listing not found' });
    }

    if (listing.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this listing' });
    }

    await Listing.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Listing deleted successfully',
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllListings: exports.getAllListings,
  getListingById: exports.getListingById,
  reserveListing: exports.reserveListing,
  createListing: exports.createListing,
  updateListing: exports.updateListing,
  deleteListing: exports.deleteListing,
};
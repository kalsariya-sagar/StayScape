const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Listing title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    images: {
      type: [
        {
          url: {
            type: String,
            required: [true, 'Image URL is required'],
          },
          filename: {
            type: String,
            required: [true, 'Image filename/public_id is required'],
          },
        },
      ],
      validate: [
        (val) => Array.isArray(val) && val.length > 0,
        'At least one image is required',
      ],
    },
    price: {
      type: Number,
      required: [true, 'Price per night is required'],
      min: [1, 'Price must be greater than 0'],
    },
    location: {
      type: String,
      required: [true, 'Specific address/location is required'],
      trim: true,
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
    },
    country: {
      type: String,
      required: [true, 'Country is required'],
      trim: true,
    },
    geometry: {
      type: {
        type: String,
        enum: ['Point'],
        required: true,
        default: 'Point',
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
      },
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: {
        values: [
          'Trending',
          'Rooms',
          'Iconic Cities',
          'Mountains',
          'Castles',
          'Amazing Pools',
          'Camping',
          'Farms',
          'Arctic',
          'Beachfront',
          'Cabins',
          'Domes',
          'Luxe',
          'Tiny Homes',
          'Tropical',
        ],
        message: '{VALUE} is not a valid category',
      },
    },
    maxGuests: {
      type: Number,
      required: [true, 'Maximum guest capacity is required'],
      min: [1, 'Maximum guests must be at least 1'],
      default: 2,
    },
    bedrooms: {
      type: Number,
      default: 1,
      min: [0, 'Bedrooms cannot be negative'],
    },
    beds: {
      type: Number,
      default: 1,
      min: [1, 'Beds must be at least 1'],
    },
    bathrooms: {
      type: Number,
      default: 1,
      min: [0.5, 'Bathrooms must be at least 0.5'],
    },
    amenities: {
      type: [String],
      default: [],
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review',
      },
    ],
    averageRating: {
      type: Number,
      default: 0,
      min: [0, 'Rating cannot be less than 0'],
      max: [5, 'Rating cannot exceed 5'],
      set: (val) => Math.round(val * 10) / 10,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Geospatial index for distance-based queries & Mapbox rendering
listingSchema.index({ geometry: '2dsphere' });

// Compound text index for title, city, country, location search
listingSchema.index({
  title: 'text',
  city: 'text',
  country: 'text',
  location: 'text',
});

// Single field indexes for fast filter queries
listingSchema.index({ category: 1 });
listingSchema.index({ price: 1 });
listingSchema.index({ owner: 1 });

// Cascade delete reviews when a listing is deleted
listingSchema.post('findOneAndDelete', async function (doc) {
  if (doc) {
    const Review = mongoose.model('Review');
    await Review.deleteMany({ _id: { $in: doc.reviews } });
  }
});

const Listing = mongoose.model('Listing', listingSchema);

module.exports = Listing;
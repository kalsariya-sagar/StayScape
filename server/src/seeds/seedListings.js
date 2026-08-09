const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('../models/User');
const Listing = require('../models/Listing');

const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/stayscape';

const sampleListings = [
  {
    title: 'Cozy Beachfront Cottage with Panoramic Ocean Views',
    description:
      'Escape to this tranquil beachfront sanctuary with direct access to private golden sands. Features floor-to-ceiling windows, modern coastal decor, a fully equipped gourmet kitchen, and a private oceanfront deck perfect for watching sunsets.',
    price: 250,
    location: 'Malibu, California, United States',
    city: 'Malibu',
    country: 'United States',
    category: 'Beachfront',
    amenities: ['WiFi', 'Kitchen', 'Parking', 'Air Conditioning', 'TV'],
    geometry: {
      type: 'Point',
      coordinates: [-118.7798, 34.0259],
    },
    images: [
      {
        url: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?q=80&w=1200&auto=format&fit=crop',
        filename: 'seed_beachfront_1',
      },
      {
        url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop',
        filename: 'seed_beachfront_2',
      },
    ],
  },
  {
    title: 'A-Frame Alpine Cabin in the Pine Forest',
    description:
      'Immerse yourself in nature in this stunning handcrafted A-frame cabin tucked deep in the towering pines. Includes an outdoor cedar wood hot tub, stone fireplace, cozy loft bedroom, and wrap-around stargazing deck.',
    price: 180,
    location: 'Aspen, Colorado, United States',
    city: 'Aspen',
    country: 'United States',
    category: 'Cabins',
    amenities: ['WiFi', 'Parking', 'Hot tub', 'Kitchen'],
    geometry: {
      type: 'Point',
      coordinates: [-106.8175, 39.1911],
    },
    images: [
      {
        url: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1200&auto=format&fit=crop',
        filename: 'seed_cabin_1',
      },
      {
        url: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?q=80&w=1200&auto=format&fit=crop',
        filename: 'seed_cabin_2',
      },
    ],
  },
  {
    title: 'Modern Luxury Villa with Infinity Pool',
    description:
      'Experience pure luxury in this architectural masterpiece overlooking rolling hills. Boasts an expansive rim-flow infinity pool, outdoor kitchen with grill, designer interior furnishings, and floor-to-ceiling glass walls.',
    price: 520,
    location: 'Miami, Florida, United States',
    city: 'Miami',
    country: 'United States',
    category: 'Amazing Pools',
    amenities: ['WiFi', 'Pool', 'Parking', 'Air Conditioning', 'Kitchen', 'TV'],
    geometry: {
      type: 'Point',
      coordinates: [-80.1918, 25.7617],
    },
    images: [
      {
        url: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?q=80&w=1200&auto=format&fit=crop',
        filename: 'seed_pool_1',
      },
      {
        url: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=1200&auto=format&fit=crop',
        filename: 'seed_pool_2',
      },
    ],
  },
  {
    title: 'Penthouse Loft in Downtown Manhattan',
    description:
      'Live high above the city in this spacious, sun-drenched industrial loft located in the heart of SoHo. High ceilings, exposed brick walls, private rooftop access, and walking distance to top restaurants.',
    price: 340,
    location: 'New York, NY, United States',
    city: 'New York',
    country: 'United States',
    category: 'Iconic Cities',
    amenities: ['WiFi', 'Air Conditioning', 'TV', 'Kitchen', 'Washer'],
    geometry: {
      type: 'Point',
      coordinates: [-73.935242, 40.73061],
    },
    images: [
      {
        url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1200&auto=format&fit=crop',
        filename: 'seed_loft_1',
      },
      {
        url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=1200&auto=format&fit=crop',
        filename: 'seed_loft_2',
      },
    ],
  },
  {
    title: 'Historic French Chateau with Private Vineyard',
    description:
      'Step back in time at this magnificently restored 18th-century French chateau. Surrounded by lush vineyards, grand gardens, marble fireplaces, and antique furnishings with all modern luxury conveniences.',
    price: 850,
    location: 'Bordeaux, France',
    city: 'Bordeaux',
    country: 'France',
    category: 'Castles',
    amenities: ['WiFi', 'Parking', 'Pool', 'Kitchen', 'TV'],
    geometry: {
      type: 'Point',
      coordinates: [-0.5792, 44.8378],
    },
    images: [
      {
        url: 'https://images.unsplash.com/photo-1585543805890-6051f7829f98?q=80&w=1200&auto=format&fit=crop',
        filename: 'seed_castle_1',
      },
    ],
  },
  {
    title: 'Futuristic Geodesic Stargazing Dome',
    description:
      'Unplug and connect with the night sky in this off-grid luxury geodesic dome. Equipped with a skylight stargazing roof, plush king mattress, private ensuite bath, and solar powered deck.',
    price: 210,
    location: 'Sedona, Arizona, United States',
    city: 'Sedona',
    country: 'United States',
    category: 'Domes',
    amenities: ['WiFi', 'Parking', 'Air Conditioning'],
    geometry: {
      type: 'Point',
      coordinates: [-111.761, 34.8697],
    },
    images: [
      {
        url: 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?q=80&w=1200&auto=format&fit=crop',
        filename: 'seed_dome_1',
      },
    ],
  },
  {
    title: 'Tranquil Redwood Treehouse in Coastal Forest',
    description:
      'Nestled 30 feet up in ancient giant redwood trees, this architectural treehouse features suspension bridge access, floor-to-ceiling forest canopy views, a skylight above the plush king bed, and a private cedar hot tub deck.',
    price: 295,
    location: 'Big Sur, California, United States',
    city: 'Big Sur',
    country: 'United States',
    category: 'Treehouses',
    amenities: ['WiFi', 'Hot tub', 'Parking', 'Kitchen'],
    geometry: {
      type: 'Point',
      coordinates: [-121.8071, 36.2704],
    },
    images: [
      {
        url: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=1200&auto=format&fit=crop',
        filename: 'seed_treehouse_1',
      },
      {
        url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=1200&auto=format&fit=crop',
        filename: 'seed_treehouse_2',
      },
    ],
  },
  {
    title: 'Cliffside Mediterranean Villa with Sunset Views',
    description:
      'Perched atop dramatic ocean cliffs overlooking the Aegean Sea, this whitewashed Mediterranean villa boasts a private infinity plunge pool, terracotta sun terrace, outdoor dining pergola, and panoramic sunset vistas.',
    price: 640,
    location: 'Santorini, Greece',
    city: 'Santorini',
    country: 'Greece',
    category: 'Luxury Stays',
    amenities: ['WiFi', 'Pool', 'Air Conditioning', 'Kitchen', 'TV', 'Parking'],
    geometry: {
      type: 'Point',
      coordinates: [25.396, 36.3932],
    },
    images: [
      {
        url: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?q=80&w=1200&auto=format&fit=crop',
        filename: 'seed_mediterranean_1',
      },
      {
        url: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=1200&auto=format&fit=crop',
        filename: 'seed_mediterranean_2',
      },
    ],
  },
];

async function seedDB() {
  try {
    await mongoose.connect(mongoURI);
    console.log(`[MongoDB] Connected: ${mongoose.connection.host}`);
    console.log('[Seed] Non-destructive idempotent mode active.');

    // 1. Find or create Sagar Kalsariya
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('KalsariyaSagar@123', salt);

    const sagarUser = await User.findOneAndUpdate(
      {
        $or: [{ username: 'sagar123' }, { email: 'sagar@gmail.com' }],
      },
      {
        $setOnInsert: {
          username: 'sagar123',
          email: 'sagar@gmail.com',
          password: hashedPassword,
        },
        $set: {
          firstName: 'Sagar',
          lastName: 'Kalsariya',
          bio: 'Passionate host sharing luxury and unique stays around the world.',
        },
      },
      { new: true, upsert: true }
    );

    console.log(`[Seed] Target Host: ${sagarUser.firstName} ${sagarUser.lastName} (@${sagarUser.username})`);

    // 2. Reassign all existing listings in DB to Sagar Kalsariya
    const reassigned = await Listing.updateMany({}, { owner: sagarUser._id });
    if (reassigned.modifiedCount > 0) {
      console.log(`[Seed] Reassigned ${reassigned.modifiedCount} existing listings to Sagar Kalsariya.`);
    }

    // 3. Upsert exactly 8 sample listings
    let upsertedCount = 0;
    for (const item of sampleListings) {
      await Listing.findOneAndUpdate(
        { title: item.title },
        {
          ...item,
          owner: sagarUser._id,
        },
        { new: true, upsert: true }
      );
      upsertedCount++;
    }

    const totalCount = await Listing.countDocuments();
    console.log(`[Seed] ${upsertedCount} sample listings upserted successfully.`);
    console.log(`[Seed] Total listings present in database: ${totalCount}`);
    console.log('[Seed] Database seeding completed successfully.');
  } catch (err) {
    console.error('[Seed Error]:', err);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
    console.log('[MongoDB] Connection closed.');
  }
}

seedDB();
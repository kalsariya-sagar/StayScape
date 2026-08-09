const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('./config/passport');
const { globalLimiter } = require('./middlewares/rateLimiter');
const errorHandler = require('./middlewares/errorHandler');
const ApiError = require('./utils/ApiError');

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const listingRoutes = require('./routes/listingRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');

const app = express();

// 1. MUST BE FIRST: Enable proxy trust for Render HTTPS load balancers
app.set('trust proxy', 1);

// HTTP Request Logger
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// 2. Parse and sanitize CLIENT_URL
const rawClientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
const clientUrls = rawClientUrl
  .split(',')
  .map((url) => url.trim().replace(/\/$/, ''))
  .filter(Boolean);

const allowedOrigins = Array.from(
  new Set([
    ...clientUrls,
    'https://stayscape-mocha.vercel.app',
    'http://localhost:5173',
    'http://localhost:4173',
    'http://localhost:3000',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:4173',
  ])
);

// Dynamic CORS Configuration
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);

    const cleanOrigin = origin.replace(/\/$/, '');
    const isAllowed =
      allowedOrigins.includes(cleanOrigin) ||
      cleanOrigin.endsWith('.vercel.app') ||
      cleanOrigin.includes('localhost') ||
      cleanOrigin.includes('127.0.0.1');

    if (isAllowed) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin',
  ],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

// Body Parsing Middlewares
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser(process.env.SESSION_SECRET || 'supersecretkey'));

// Global Rate Limiting
app.use('/api', globalLimiter);

// Express Session Configuration with MongoDB Store
const isProduction = process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'prod';

app.use(
  session({
    name: 'stayscape.sid',
    secret: process.env.SESSION_SECRET || 'supersecretkey',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/stayscape',
      collectionName: 'sessions',
      ttl: 14 * 24 * 60 * 60,
      autoRemove: 'native',
    }),
    cookie: {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      maxAge: 14 * 24 * 60 * 60 * 1000,
    },
  })
);

// Initialize Passport & Restore Authentication State from Session
app.use(passport.initialize());
app.use(passport.session());

// Root Welcome Endpoint (Prevents Render 404 GET / logs)
app.get('/', (req, res) => {
  res.status(200).send('StayScape API Server is running live!');
});

// System Healthcheck Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// API Routes Mounting
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/wishlist', wishlistRoutes);

// Catch 404 and forward to global error handler
app.use((req, res, next) => {
  next(new ApiError(404, `Cannot ${req.method} ${req.originalUrl} - Route Not Found`));
});

// Global Error Handler Middleware
app.use(errorHandler);

module.exports = app;
const rateLimit = require('express-rate-limit');
const ApiError = require('../utils/ApiError');

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 1000, 
  standardHeaders: true, 
  legacyHeaders: false, 
  handler: (req, res, next) => {
    next(
      new ApiError(
        429,
        'Too many requests from this IP address. Please try again after 15 minutes.'
      )
    );
  },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 15, 
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next) => {
    next(
      new ApiError(
        429,
        'Too many authentication attempts from this IP. Please try again after 15 minutes.'
      )
    );
  },
});

module.exports = {
  globalLimiter,
  authLimiter,
};
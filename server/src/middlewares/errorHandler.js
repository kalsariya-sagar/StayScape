const ApiError = require('../utils/ApiError');
const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  let error = err;

  // If error is not an instance of ApiError, convert it
  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || (error.name === 'ValidationError' ? 400 : 500);
    const message = error.message || 'Internal Server Error';
    error = new ApiError(statusCode, message, error.errors || [], err.stack);
  }

  // Handle Mongoose CastError (invalid ObjectId)
  if (err.name === 'CastError') {
    const message = `Resource not found. Invalid ID format for field: ${err.path}`;
    error = new ApiError(400, message);
  }

  // Handle Mongoose Duplicate Key Error (11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    const message = `Duplicate field value entered for '${field}'. Please use another value.`;
    error = new ApiError(400, message);
  }

  // Handle Mongoose ValidationError
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((val) => val.message);
    const message = `Invalid input data. ${messages.join('. ')}`;
    error = new ApiError(400, message, messages);
  }

  // Handle Multer upload errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    error = new ApiError(400, 'File size exceeds maximum allowed limit (5MB).');
  }

  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    error = new ApiError(400, 'Unexpected field in image upload payload.');
  }

  const { statusCode, message, errors } = error;

  // Log non-operational / internal server errors
  if (statusCode >= 500) {
    logger.error(`[${req.method}] ${req.originalUrl} - ${message}`, {
      stack: error.stack,
      body: req.body,
    });
  } else {
    logger.warn(`[${req.method}] ${req.originalUrl} - ${statusCode} - ${message}`);
  }

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    errors: errors.length > 0 ? errors : undefined,
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
  });
};

module.exports = errorHandler;
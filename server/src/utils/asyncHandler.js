/**
 * Wrapper for asynchronous Express route handlers to automatically catch errors
 * and forward them to the global error middleware.
 * 
 * @param {Function} requestHandler - Asynchronous Express route handler function
 * @returns {Function} Express middleware function
 */
const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
  };
};

module.exports = asyncHandler;
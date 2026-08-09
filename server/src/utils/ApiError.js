class ApiError extends Error {
  /**
   * Custom Operational Error Class for API Handlers
   * @param {number} statusCode - HTTP Status Code
   * @param {string} message - Error description
   * @param {Array} errors - Array of specific error details (e.g. Joi validation error messages)
   * @param {string} stack - Optional stack trace override
   */
  constructor(
    statusCode,
    message = 'Something went wrong',
    errors = [],
    stack = ''
  ) {
    super(message);
    this.statusCode = statusCode;
    this.data = null;
    this.message = message;
    this.success = false;
    this.errors = errors;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

module.exports = ApiError;
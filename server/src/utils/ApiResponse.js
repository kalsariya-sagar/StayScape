class ApiResponse {
  /**
   * Standardized API Response Structure
   * @param {number} statusCode - HTTP Status Code (< 400 for success)
   * @param {any} data - Payload data returned to the client
   * @param {string} message - Response message
   */
  constructor(statusCode, data = null, message = 'Success') {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400;
  }
}

module.exports = ApiResponse;
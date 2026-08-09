const ApiError = require('../utils/ApiError');

/**
 * Higher-order middleware factory for validating requests against a Joi schema
 * 
 * @param {Object} schema - Joi schema object
 * @param {string} property - Request property to validate ('body', 'query', 'params')
 * @returns {Function} Express middleware function
 */
const validate = (schema, property = 'body') => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errorMessages = error.details.map((detail) => detail.message.replace(/"/g, ''));
      return next(new ApiError(400, errorMessages.join('. '), errorMessages));
    }

    // Replace req[property] with sanitized and type-cast validated value
    req[property] = value;
    next();
  };
};

module.exports = validate;
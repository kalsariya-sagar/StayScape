const Joi = require('joi');

const reviewSchema = Joi.object({
  rating: Joi.number().min(1).max(5).required().messages({
    'number.base': 'Rating must be a valid number between 1 and 5.',
    'number.min': 'Rating must be at least 1 star.',
    'number.max': 'Rating cannot exceed 5 stars.',
  }),
  comment: Joi.string().trim().required().messages({
    'string.empty': 'Review comment cannot be empty.',
  }),
});

const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }
  next();
};

module.exports = {
  validateReview,
};
module.exports.validateReview = validateReview;
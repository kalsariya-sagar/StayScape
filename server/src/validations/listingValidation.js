const Joi = require('joi');

const listingSchema = Joi.object({
  title: Joi.string().required().messages({
    'string.empty': 'Title is required.',
  }),
  description: Joi.string().required().messages({
    'string.empty': 'Description is required.',
  }),
  price: Joi.number().min(0).required().messages({
    'number.base': 'Price must be a valid number.',
    'number.min': 'Price cannot be negative.',
  }),
  location: Joi.string().required().messages({
    'string.empty': 'Location is required.',
  }),
  city: Joi.string().allow('', null),
  country: Joi.string().allow('', null),
  category: Joi.string().allow('', null),
  amenities: Joi.alternatives()
    .try(Joi.array().items(Joi.string()), Joi.string())
    .optional(),
  deletedImages: Joi.alternatives()
    .try(Joi.array().items(Joi.string()), Joi.string())
    .optional(),
});

const validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body, { allowUnknown: true });
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }
  next();
};

module.exports = {
  validateListing,
};
module.exports.validateListing = validateListing;
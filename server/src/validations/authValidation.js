const Joi = require('joi');

// Requires min 8 chars with 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character
const passwordPattern = new RegExp(
  '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\\-=\\[\\]{};:\'",.<>\\/?])'
);

const registerSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required().messages({
    'string.empty': 'Username is required.',
    'string.min': 'Username must be at least 3 characters long.',
    'string.alphanum': 'Username must contain only letters and numbers.',
  }),
  email: Joi.string().email().required().messages({
    'string.empty': 'Email address is required.',
    'string.email': 'Please enter a valid email address.',
  }),
  password: Joi.string()
    .min(8)
    .max(30)
    .pattern(passwordPattern)
    .required()
    .messages({
      'string.empty': 'Password is required.',
      'string.min': 'Password must be at least 8 characters long.',
      'string.max': 'Password cannot exceed 30 characters.',
      'string.pattern.base':
        'Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character.',
    }),
  firstName: Joi.string().allow('', null),
  lastName: Joi.string().allow('', null),
  bio: Joi.string().allow('', null),
});

const loginSchema = Joi.object({
  usernameOrEmail: Joi.string().required().messages({
    'string.empty': 'Username or email is required.',
  }),
  username: Joi.string().optional(),
  email: Joi.string().optional(),
  password: Joi.string().required().messages({
    'string.empty': 'Password is required.',
  }),
}).or('usernameOrEmail', 'username', 'email');

exports.validateRegister = (req, res, next) => {
  const { error } = registerSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }
  next();
};

exports.validateLogin = (req, res, next) => {
  const { error } = loginSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }
  next();
};
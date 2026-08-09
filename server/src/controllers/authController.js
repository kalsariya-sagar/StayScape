const bcrypt = require('bcryptjs');
const User = require('../models/User');

exports.register = async (req, res, next) => {
  try {
    const { username, email, password, firstName, lastName, bio } = req.body;

    const existingUser = await User.findOne({
      $or: [
        { email: email.toLowerCase() },
        { username: username.toLowerCase() },
      ],
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Username or email already exists',
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      password: hashedPassword,
      firstName,
      lastName,
      bio,
    });

    await user.save();

    req.login(user, (err) => {
      if (err) return next(err);
      return res.status(201).json({
        success: true,
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          bio: user.bio,
        },
      });
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: Object.values(err.errors).map((e) => e.message).join(', '),
      });
    }
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { usernameOrEmail, username, email, password } = req.body;
    const identifier = (usernameOrEmail || username || email || '').trim().toLowerCase();

    if (!identifier || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email/username and password',
      });
    }

    const user = await User.findOne({
      $or: [{ email: identifier }, { username: identifier }],
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email/username or password',
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email/username or password',
      });
    }

    req.login(user, (err) => {
      if (err) return next(err);
      return res.status(200).json({
        success: true,
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          bio: user.bio,
          wishlist: user.wishlist,
        },
      });
    });
  } catch (err) {
    next(err);
  }
};

exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an email address.',
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    return res.status(200).json({
      success: true,
      message: `If an account exists for ${email}, password reset instructions have been sent.`,
    });
  } catch (err) {
    next(err);
  }
};

exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.session.destroy(() => {
      res.clearCookie('stayscape.sid');
      return res.status(200).json({
        success: true,
        message: 'Logged out successfully',
      });
    });
  });
};

exports.getCurrentUser = (req, res) => {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return res.status(200).json({
      isAuthenticated: true,
      user: {
        _id: req.user._id,
        username: req.user.username,
        email: req.user.email,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        bio: req.user.bio,
        wishlist: req.user.wishlist,
      },
    });
  }
  return res.status(200).json({
    isAuthenticated: false,
    user: null,
  });
};
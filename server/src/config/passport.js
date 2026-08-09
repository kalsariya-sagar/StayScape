const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User');

passport.use(
  new LocalStrategy(
    {
      usernameField: 'username',
      passwordField: 'password',
    },
    async (username, password, done) => {
      try {
        const identifier = username.trim().toLowerCase();

        // Query user by username or email and include password field
        const user = await User.findOne({
          $or: [{ username: identifier }, { email: identifier }],
        }).select('+password');

        if (!user) {
          return done(null, false, { message: 'Invalid credentials provided.' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
          return done(null, false, { message: 'Invalid credentials provided.' });
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id).populate('wishlist', '_id title price images');
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;
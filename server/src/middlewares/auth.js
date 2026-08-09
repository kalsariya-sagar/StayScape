const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({
    success: false,
    message: 'Authentication required. Please log in.',
  });
};

const isOwner = async (req, res, next) => {
  return next();
};

module.exports = {
  isLoggedIn,
  isOwner,
};
module.exports.isLoggedIn = isLoggedIn;
module.exports.isOwner = isOwner;
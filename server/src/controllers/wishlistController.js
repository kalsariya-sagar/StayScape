const User = require('../models/User');

exports.getWishlist = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: 'wishlist',
      populate: { path: 'owner', select: 'username firstName lastName' },
    });

    res.status(200).json({
      success: true,
      data: user ? user.wishlist : [],
      wishlist: user ? user.wishlist : [],
    });
  } catch (err) {
    next(err);
  }
};

exports.addToWishlist = async (req, res, next) => {
  try {
    const { listingId } = req.params;
    const user = await User.findById(req.user._id);

    if (!user.wishlist.includes(listingId)) {
      user.wishlist.push(listingId);
      await user.save();
    }

    const updatedUser = await User.findById(req.user._id).populate('wishlist');

    res.status(200).json({
      success: true,
      wishlist: updatedUser.wishlist,
    });
  } catch (err) {
    next(err);
  }
};

exports.removeFromWishlist = async (req, res, next) => {
  try {
    const { listingId } = req.params;
    const user = await User.findById(req.user._id);

    user.wishlist = user.wishlist.filter(
      (id) => id.toString() !== listingId.toString()
    );
    await user.save();

    const updatedUser = await User.findById(req.user._id).populate('wishlist');

    res.status(200).json({
      success: true,
      wishlist: updatedUser.wishlist,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getWishlist: exports.getWishlist,
  addToWishlist: exports.addToWishlist,
  removeFromWishlist: exports.removeFromWishlist,
};
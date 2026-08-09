const User = require('../models/User');
const Listing = require('../models/Listing');

exports.getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const listings = await Listing.find({ owner: req.params.id }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      data: {
        user,
        listings,
      },
      user,
      listings,
    });
  } catch (err) {
    next(err);
  }
};

exports.updateUserProfile = async (req, res, next) => {
  try {
    const { firstName, lastName, bio } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (firstName !== undefined) user.firstName = firstName;
    if (lastName !== undefined) user.lastName = lastName;
    if (bio !== undefined) user.bio = bio;

    await user.save();

    res.status(200).json({
      success: true,
      data: {
        _id: user._id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        bio: user.bio,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.updateUserAvatar = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      message: 'Avatar update acknowledged',
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getUserProfile: exports.getUserProfile,
  updateUserProfile: exports.updateUserProfile,
  updateUserAvatar: exports.updateUserAvatar,
};
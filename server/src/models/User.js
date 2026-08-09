const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    firstName: {
      type: String,
      default: '',
    },
    lastName: {
      type: String,
      default: '',
    },
    bio: {
      type: String,
      default: '',
    },
    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Listing',
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
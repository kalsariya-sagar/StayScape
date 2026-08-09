const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const listingStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'stayscape/listings',
    allowed_formats: ['jpeg', 'jpg', 'png', 'webp'],
    transformation: [{ width: 1200, height: 800, crop: 'limit', quality: 'auto' }],
  },
});

const avatarStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'stayscape/avatars',
    allowed_formats: ['jpeg', 'jpg', 'png', 'webp'],
    transformation: [{ width: 400, height: 400, crop: 'fill', gravity: 'face', quality: 'auto' }],
  },
});

/**
 * Deletes an image resource from Cloudinary using its public ID
 * @param {string} publicId - Public identifier of the image asset on Cloudinary
 * @returns {Promise<Object>} Cloudinary deletion API result
 */
const deleteImageFromCloudinary = async (publicId) => {
  try {
    if (!publicId) return null;
    return await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error);
    throw error;
  }
};

module.exports = {
  cloudinary,
  listingStorage,
  avatarStorage,
  deleteImageFromCloudinary,
};
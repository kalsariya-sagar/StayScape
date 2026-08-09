const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const isCloudinaryConfigured =
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET;

let storage;

if (isCloudinaryConfigured) {
  storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'stayscape',
      allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
    },
  });
} else {
  storage = multer.memoryStorage();
}

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, 
});

// Dual export for destructured or default imports
upload.upload = upload;
module.exports = upload;
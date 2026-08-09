const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const getUserProfile = userController.getUserProfile;
const updateUserProfile = userController.updateUserProfile;
const updateUserAvatar = userController.updateUserAvatar;

const authMiddleware = require('../middlewares/auth');
const isLoggedIn = authMiddleware.isLoggedIn || authMiddleware;

const uploadMiddleware = require('../middlewares/upload');
const upload = uploadMiddleware.upload || uploadMiddleware;

// GET /api/users/:id
router.get('/:id', getUserProfile);

// PUT /api/users/profile
router.put('/profile', isLoggedIn, updateUserProfile);

// PUT /api/users/avatar
router.put('/avatar', isLoggedIn, upload.single('avatar'), updateUserAvatar);

module.exports = router;
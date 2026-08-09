const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validateRegister, validateLogin } = require('../validations/authValidation');

router.post('/register', validateRegister, authController.register);
router.post('/login', validateLogin, authController.login);
router.post('/forgot-password', authController.forgotPassword);
router.post('/logout', authController.logout);
router.get('/me', authController.getCurrentUser);

module.exports = router;
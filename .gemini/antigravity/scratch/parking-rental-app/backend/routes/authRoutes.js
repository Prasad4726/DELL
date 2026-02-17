const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticate } = require('../middlewares/authMiddleware');
const { validate } = require('../middlewares/validationMiddleware');
const { registerValidator, loginValidator } = require('../utils/validators');

/**
 * Authentication Routes
 * Base path: /api/auth
 */

// Public routes
router.post('/register', registerValidator, validate, authController.register);
router.post('/login', loginValidator, validate, authController.login);

// Protected routes
router.get('/profile', authenticate, authController.getProfile);
router.post('/refresh', authenticate, authController.refreshToken);

module.exports = router;

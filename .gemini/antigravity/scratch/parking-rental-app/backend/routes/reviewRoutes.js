const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { authenticate } = require('../middlewares/authMiddleware');
const { validate } = require('../middlewares/validationMiddleware');
const { createReviewValidator } = require('../utils/validators');

/**
 * Review Routes
 * Base path: /api/reviews
 */

// Public routes
router.get('/parking/:parkingId', reviewController.getParkingReviews);

// Protected routes
router.use(authenticate);

router.post('/', createReviewValidator, validate, reviewController.createReview);
router.get('/my', reviewController.getMyReviews);

module.exports = router;

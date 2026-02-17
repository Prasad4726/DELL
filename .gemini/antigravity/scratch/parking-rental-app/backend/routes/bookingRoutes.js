const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { authenticate } = require('../middlewares/authMiddleware');
const { validate } = require('../middlewares/validationMiddleware');
const { createBookingValidator, cancelBookingValidator } = require('../utils/validators');

/**
 * Booking Routes
 * Base path: /api/bookings
 */

// All booking routes require authentication
router.use(authenticate);

// Create booking
router.post('/', createBookingValidator, validate, bookingController.createBooking);

// Get user's bookings
router.get('/my', bookingController.getMyBookings);

// Check availability
router.post('/check-availability', bookingController.checkAvailability);

// Get booking by ID
router.get('/:id', bookingController.getBookingById);

// Cancel booking
router.post('/:id/cancel', cancelBookingValidator, validate, bookingController.cancelBooking);

// Activate booking
router.post('/:id/activate', bookingController.activateBooking);

// Complete booking
router.post('/:id/complete', bookingController.completeBooking);

module.exports = router;

const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { authenticate } = require('../middlewares/authMiddleware');
const { validate } = require('../middlewares/validationMiddleware');
const { createPaymentValidator } = require('../utils/validators');

/**
 * Payment Routes
 * Base path: /api/payments
 */

// Webhook route (public - for payment gateway callbacks)
router.post('/webhook', paymentController.handleWebhook);

// All other payment routes require authentication
router.use(authenticate);

// Create payment
router.post('/', createPaymentValidator, validate, paymentController.createPayment);

// Process payment
router.post('/:id/process', paymentController.processPayment);

// Get payment by booking ID
router.get('/booking/:bookingId', paymentController.getPaymentByBookingId);

// Verify payment
router.get('/:id/verify', paymentController.verifyPayment);

// Process refund
router.post('/:id/refund', paymentController.processRefund);

module.exports = router;

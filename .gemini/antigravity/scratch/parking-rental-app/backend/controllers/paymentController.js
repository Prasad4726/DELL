const paymentService = require('../services/paymentService');
const { SUCCESS_MESSAGES } = require('../utils/constants');
const { successResponse } = require('../utils/helpers');

/**
 * Payment Controller
 * Handles payment processing endpoints
 */

/**
 * Create payment for a booking
 * POST /api/payments
 */
const createPayment = async (req, res, next) => {
    try {
        const { bookingId, paymentMethod } = req.body;

        const payment = await paymentService.createPayment(bookingId, paymentMethod);

        res.status(201).json(
            successResponse('Payment initiated successfully', payment)
        );
    } catch (error) {
        next(error);
    }
};

/**
 * Process payment
 * POST /api/payments/:id/process
 */
const processPayment = async (req, res, next) => {
    try {
        const payment = await paymentService.processPayment(req.params.id, req.body);

        res.status(200).json(
            successResponse(SUCCESS_MESSAGES.PAYMENT_SUCCESS, payment)
        );
    } catch (error) {
        next(error);
    }
};

/**
 * Get payment by booking ID
 * GET /api/payments/booking/:bookingId
 */
const getPaymentByBookingId = async (req, res, next) => {
    try {
        const payment = await paymentService.getPaymentByBookingId(req.params.bookingId);

        res.status(200).json(
            successResponse('Payment retrieved successfully', payment)
        );
    } catch (error) {
        next(error);
    }
};

/**
 * Verify payment status
 * GET /api/payments/:id/verify
 */
const verifyPayment = async (req, res, next) => {
    try {
        const status = await paymentService.verifyPaymentStatus(req.params.id);

        res.status(200).json(
            successResponse('Payment status verified', status)
        );
    } catch (error) {
        next(error);
    }
};

/**
 * Process refund
 * POST /api/payments/:id/refund
 */
const processRefund = async (req, res, next) => {
    try {
        const payment = await paymentService.processRefund(req.params.id);

        res.status(200).json(
            successResponse('Refund processed successfully', payment)
        );
    } catch (error) {
        next(error);
    }
};

/**
 * Payment webhook handler (for payment gateway callbacks)
 * POST /api/payments/webhook
 */
const handleWebhook = async (req, res, next) => {
    try {
        // In production, verify webhook signature from payment gateway
        const { paymentId, status, transactionId } = req.body;

        if (status === 'success') {
            await paymentService.processPayment(paymentId, {
                success: true,
                transactionId
            });
        } else {
            await paymentService.handlePaymentFailure(paymentId);
        }

        res.status(200).json({ received: true });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createPayment,
    processPayment,
    getPaymentByBookingId,
    verifyPayment,
    processRefund,
    handleWebhook
};

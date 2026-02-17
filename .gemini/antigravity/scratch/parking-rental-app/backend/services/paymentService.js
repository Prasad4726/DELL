const { Payment, Booking, sequelize } = require('../models');
const { PAYMENT_STATUS, PAYMENT_METHODS, BOOKING_STATUS, ERROR_MESSAGES } = require('../utils/constants');
const { AppError } = require('../middlewares/errorMiddleware');
const bookingService = require('./bookingService');

/**
 * Payment Service
 * Handles payment processing and booking integration
 */

/**
 * Create payment for a booking
 * @param {number} bookingId 
 * @param {string} paymentMethod 
 * @returns {Object} Created payment
 */
const createPayment = async (bookingId, paymentMethod) => {
    // Get booking details
    const booking = await Booking.findByPk(bookingId);

    if (!booking) {
        throw new AppError(ERROR_MESSAGES.BOOKING_NOT_FOUND, 404);
    }

    if (booking.status !== BOOKING_STATUS.PENDING) {
        throw new AppError('Booking is not in pending status', 400);
    }

    // Check if payment already exists
    const existingPayment = await Payment.findOne({ where: { bookingId } });

    if (existingPayment) {
        if (existingPayment.status === PAYMENT_STATUS.SUCCESS) {
            throw new AppError('Payment already completed for this booking', 400);
        }
        // Return existing pending payment
        return existingPayment;
    }

    // Create payment record
    const payment = await Payment.create({
        bookingId,
        amount: booking.totalPrice,
        paymentMethod,
        status: PAYMENT_STATUS.PENDING,
        paymentGateway: getPaymentGateway(paymentMethod)
    });

    return payment;
};

/**
 * Process payment (integration point for payment gateway)
 * @param {number} paymentId 
 * @param {Object} paymentData - Payment gateway response
 * @returns {Object} Updated payment
 */
const processPayment = async (paymentId, paymentData) => {
    const transaction = await sequelize.transaction();

    try {
        const payment = await Payment.findByPk(paymentId, {
            include: [{ model: Booking, as: 'booking' }],
            lock: transaction.LOCK.UPDATE,
            transaction
        });

        if (!payment) {
            throw new AppError(ERROR_MESSAGES.PAYMENT_NOT_FOUND, 404);
        }

        if (payment.status === PAYMENT_STATUS.SUCCESS) {
            throw new AppError('Payment already processed', 400);
        }

        // Simulate payment gateway processing
        // In production, integrate with actual payment gateway (Stripe, PayPal, Razorpay)
        const isPaymentSuccessful = await processWithGateway(payment, paymentData);

        if (isPaymentSuccessful) {
            // Mark payment as successful
            await payment.markSuccess(
                paymentData.transactionId || generateTransactionId(),
                paymentData
            );

            // Confirm booking
            await payment.booking.update(
                { status: BOOKING_STATUS.CONFIRMED },
                { transaction }
            );

            await transaction.commit();

            return await Payment.findByPk(paymentId, {
                include: [{ model: Booking, as: 'booking' }]
            });
        } else {
            // Payment failed
            await payment.markFailed(paymentData);
            await transaction.commit();

            throw new AppError(ERROR_MESSAGES.PAYMENT_FAILED, 400);
        }
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

/**
 * Handle payment failure and rollback booking
 * @param {number} paymentId 
 */
const handlePaymentFailure = async (paymentId) => {
    const transaction = await sequelize.transaction();

    try {
        const payment = await Payment.findByPk(paymentId, {
            include: [
                {
                    model: Booking,
                    as: 'booking',
                    include: [{ model: require('../models').ParkingSlot, as: 'slot' }]
                }
            ],
            transaction
        });

        if (!payment) {
            throw new AppError(ERROR_MESSAGES.PAYMENT_NOT_FOUND, 404);
        }

        // Mark payment as failed
        await payment.update({ status: PAYMENT_STATUS.FAILED }, { transaction });

        // Cancel booking and release slot
        await bookingService.cancelBooking(payment.bookingId, payment.booking.userId);

        await transaction.commit();
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

/**
 * Process refund
 * @param {number} paymentId 
 * @returns {Object} Refunded payment
 */
const processRefund = async (paymentId) => {
    const transaction = await sequelize.transaction();

    try {
        const payment = await Payment.findByPk(paymentId, {
            include: [{ model: Booking, as: 'booking' }],
            transaction
        });

        if (!payment) {
            throw new AppError(ERROR_MESSAGES.PAYMENT_NOT_FOUND, 404);
        }

        if (payment.status !== PAYMENT_STATUS.SUCCESS) {
            throw new AppError('Can only refund successful payments', 400);
        }

        // Process refund with payment gateway
        // In production, call actual payment gateway refund API
        await payment.refund();

        await transaction.commit();

        return payment;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

/**
 * Get payment by booking ID
 * @param {number} bookingId 
 * @returns {Object} Payment
 */
const getPaymentByBookingId = async (bookingId) => {
    const payment = await Payment.findOne({
        where: { bookingId },
        include: [{ model: Booking, as: 'booking' }]
    });

    return payment;
};

/**
 * Verify payment status
 * @param {number} paymentId 
 * @returns {Object} Payment status
 */
const verifyPaymentStatus = async (paymentId) => {
    const payment = await Payment.findByPk(paymentId);

    if (!payment) {
        throw new AppError(ERROR_MESSAGES.PAYMENT_NOT_FOUND, 404);
    }

    // In production, verify with payment gateway
    return {
        paymentId: payment.id,
        status: payment.status,
        amount: payment.amount,
        transactionId: payment.transactionId
    };
};

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get payment gateway based on method
 * @param {string} paymentMethod 
 * @returns {string} Gateway name
 */
const getPaymentGateway = (paymentMethod) => {
    const gatewayMap = {
        [PAYMENT_METHODS.CARD]: 'stripe',
        [PAYMENT_METHODS.UPI]: 'razorpay',
        [PAYMENT_METHODS.WALLET]: 'paytm',
        [PAYMENT_METHODS.CASH]: 'cash'
    };

    return gatewayMap[paymentMethod] || 'stripe';
};

/**
 * Process payment with gateway (mock implementation)
 * In production, integrate with actual payment gateway SDK
 * @param {Object} payment 
 * @param {Object} paymentData 
 * @returns {boolean} Success status
 */
const processWithGateway = async (payment, paymentData) => {
    // Mock implementation
    // In production, call actual payment gateway API

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 100));

    // For demo purposes, assume success if payment data is provided
    return paymentData && paymentData.success !== false;
};

/**
 * Generate transaction ID (mock)
 * In production, this comes from payment gateway
 * @returns {string} Transaction ID
 */
const generateTransactionId = () => {
    return `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
};

module.exports = {
    createPayment,
    processPayment,
    handlePaymentFailure,
    processRefund,
    getPaymentByBookingId,
    verifyPaymentStatus
};

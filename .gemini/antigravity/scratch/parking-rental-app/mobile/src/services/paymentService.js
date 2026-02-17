import api from './api';

/**
 * Payment Service
 * Handles payment-related API calls
 */

/**
 * Create payment for booking
 * @param {number} bookingId 
 * @param {string} paymentMethod 
 * @returns {Promise}
 */
export const createPayment = async (bookingId, paymentMethod) => {
    return await api.post('/payments', { bookingId, paymentMethod });
};

/**
 * Process payment
 * @param {number} paymentId 
 * @param {Object} paymentData 
 * @returns {Promise}
 */
export const processPayment = async (paymentId, paymentData) => {
    return await api.post(`/payments/${paymentId}/process`, paymentData);
};

/**
 * Get payment by booking ID
 * @param {number} bookingId 
 * @returns {Promise}
 */
export const getPaymentByBookingId = async (bookingId) => {
    return await api.get(`/payments/booking/${bookingId}`);
};

/**
 * Verify payment status
 * @param {number} paymentId 
 * @returns {Promise}
 */
export const verifyPayment = async (paymentId) => {
    return await api.get(`/payments/${paymentId}/verify`);
};

export default {
    createPayment,
    processPayment,
    getPaymentByBookingId,
    verifyPayment
};

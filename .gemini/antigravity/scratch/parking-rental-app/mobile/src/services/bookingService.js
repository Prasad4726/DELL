import api from './api';

/**
 * Booking Service
 * Handles booking-related API calls
 */

/**
 * Create a new booking
 * @param {Object} bookingData 
 * @returns {Promise}
 */
export const createBooking = async (bookingData) => {
    return await api.post('/bookings', bookingData);
};

/**
 * Get user's bookings
 * @param {string} status - Optional status filter
 * @returns {Promise}
 */
export const getMyBookings = async (status = null) => {
    const params = status ? { status } : {};
    return await api.get('/bookings/my', { params });
};

/**
 * Get booking by ID
 * @param {number} bookingId 
 * @returns {Promise}
 */
export const getBookingById = async (bookingId) => {
    return await api.get(`/bookings/${bookingId}`);
};

/**
 * Cancel booking
 * @param {number} bookingId 
 * @returns {Promise}
 */
export const cancelBooking = async (bookingId) => {
    return await api.post(`/bookings/${bookingId}/cancel`);
};

/**
 * Activate booking
 * @param {number} bookingId 
 * @returns {Promise}
 */
export const activateBooking = async (bookingId) => {
    return await api.post(`/bookings/${bookingId}/activate`);
};

/**
 * Complete booking
 * @param {number} bookingId 
 * @returns {Promise}
 */
export const completeBooking = async (bookingId) => {
    return await api.post(`/bookings/${bookingId}/complete`);
};

/**
 * Check slot availability
 * @param {number} slotId 
 * @param {Date} startTime 
 * @param {Date} endTime 
 * @returns {Promise}
 */
export const checkAvailability = async (slotId, startTime, endTime) => {
    return await api.post('/bookings/check-availability', {
        slotId,
        startTime,
        endTime
    });
};

export default {
    createBooking,
    getMyBookings,
    getBookingById,
    cancelBooking,
    activateBooking,
    completeBooking,
    checkAvailability
};

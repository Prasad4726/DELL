const bookingService = require('../services/bookingService');
const { SUCCESS_MESSAGES } = require('../utils/constants');
const { successResponse } = require('../utils/helpers');

/**
 * Booking Controller
 * Handles booking management endpoints
 */

/**
 * Create a new booking
 * POST /api/bookings
 */
const createBooking = async (req, res, next) => {
    try {
        const booking = await bookingService.createBooking(req.user.id, req.body);

        res.status(201).json(
            successResponse(SUCCESS_MESSAGES.BOOKING_CREATED, booking)
        );
    } catch (error) {
        next(error);
    }
};

/**
 * Get booking by ID
 * GET /api/bookings/:id
 */
const getBookingById = async (req, res, next) => {
    try {
        const booking = await bookingService.getBookingById(req.params.id);

        res.status(200).json(
            successResponse('Booking retrieved successfully', booking)
        );
    } catch (error) {
        next(error);
    }
};

/**
 * Get user's bookings
 * GET /api/bookings/my
 */
const getMyBookings = async (req, res, next) => {
    try {
        const { status } = req.query;
        const bookings = await bookingService.getUserBookings(req.user.id, { status });

        res.status(200).json(
            successResponse('Bookings retrieved successfully', {
                count: bookings.length,
                bookings
            })
        );
    } catch (error) {
        next(error);
    }
};

/**
 * Cancel booking
 * POST /api/bookings/:id/cancel
 */
const cancelBooking = async (req, res, next) => {
    try {
        const booking = await bookingService.cancelBooking(req.params.id, req.user.id);

        res.status(200).json(
            successResponse(SUCCESS_MESSAGES.BOOKING_CANCELLED, booking)
        );
    } catch (error) {
        next(error);
    }
};

/**
 * Activate booking
 * POST /api/bookings/:id/activate
 */
const activateBooking = async (req, res, next) => {
    try {
        const booking = await bookingService.activateBooking(req.params.id);

        res.status(200).json(
            successResponse('Booking activated successfully', booking)
        );
    } catch (error) {
        next(error);
    }
};

/**
 * Complete booking
 * POST /api/bookings/:id/complete
 */
const completeBooking = async (req, res, next) => {
    try {
        const booking = await bookingService.completeBooking(req.params.id);

        res.status(200).json(
            successResponse('Booking completed successfully', booking)
        );
    } catch (error) {
        next(error);
    }
};

/**
 * Check slot availability
 * POST /api/bookings/check-availability
 */
const checkAvailability = async (req, res, next) => {
    try {
        const { slotId, startTime, endTime } = req.body;
        const isAvailable = await bookingService.checkSlotAvailability(
            slotId,
            startTime,
            endTime
        );

        res.status(200).json(
            successResponse('Availability checked successfully', { isAvailable })
        );
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createBooking,
    getBookingById,
    getMyBookings,
    cancelBooking,
    activateBooking,
    completeBooking,
    checkAvailability
};

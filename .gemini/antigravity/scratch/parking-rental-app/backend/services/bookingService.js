const { Booking, ParkingSlot, Parking, User, sequelize } = require('../models');
const { BOOKING_STATUS, SLOT_STATUS, ERROR_MESSAGES } = require('../utils/constants');
const { AppError } = require('../middlewares/errorMiddleware');
const { generateBookingCode, calculateHours, calculatePrice, isValidTimeRange } = require('../utils/helpers');
const { Op } = require('sequelize');

/**
 * Booking Service
 * CRITICAL: Handles time-based bookings with concurrency control
 */

/**
 * Create a new booking with overlap prevention and concurrency handling
 * @param {number} userId 
 * @param {Object} bookingData 
 * @returns {Object} Created booking
 */
const createBooking = async (userId, bookingData) => {
    const { parkingId, slotId, startTime, endTime } = bookingData;

    // Validate time range
    if (!isValidTimeRange(startTime, endTime)) {
        throw new AppError(ERROR_MESSAGES.INVALID_BOOKING_TIME, 400);
    }

    // Check if start time is in the past
    if (new Date(startTime) < new Date()) {
        throw new AppError(ERROR_MESSAGES.BOOKING_PAST_TIME, 400);
    }

    // Start transaction with isolation level for concurrency control
    const transaction = await sequelize.transaction({
        isolationLevel: sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
    });

    try {
        // Lock the slot row to prevent concurrent bookings (FOR UPDATE)
        const slot = await ParkingSlot.findByPk(slotId, {
            lock: transaction.LOCK.UPDATE,
            transaction
        });

        if (!slot) {
            throw new AppError(ERROR_MESSAGES.SLOT_NOT_FOUND, 404);
        }

        // Verify slot belongs to the parking
        if (slot.parkingId !== parkingId) {
            throw new AppError('Slot does not belong to this parking', 400);
        }

        // Check if slot is in maintenance
        if (slot.status === SLOT_STATUS.MAINTENANCE) {
            throw new AppError('Slot is under maintenance', 400);
        }

        // Get parking details
        const parking = await Parking.findByPk(parkingId, { transaction });

        if (!parking || !parking.isActive) {
            throw new AppError(ERROR_MESSAGES.PARKING_INACTIVE, 400);
        }

        // CRITICAL: Check for overlapping bookings
        const overlappingBooking = await Booking.findOne({
            where: {
                slotId,
                status: {
                    [Op.notIn]: [BOOKING_STATUS.CANCELLED, BOOKING_STATUS.COMPLETED]
                },
                [Op.or]: [
                    // New booking starts during existing booking
                    {
                        startTime: { [Op.lte]: startTime },
                        endTime: { [Op.gt]: startTime }
                    },
                    // New booking ends during existing booking
                    {
                        startTime: { [Op.lt]: endTime },
                        endTime: { [Op.gte]: endTime }
                    },
                    // New booking completely contains existing booking
                    {
                        startTime: { [Op.gte]: startTime },
                        endTime: { [Op.lte]: endTime }
                    }
                ]
            },
            lock: transaction.LOCK.UPDATE,
            transaction
        });

        if (overlappingBooking) {
            throw new AppError(ERROR_MESSAGES.BOOKING_OVERLAP, 409);
        }

        // Calculate hours and price
        const totalHours = calculateHours(startTime, endTime);
        const totalPrice = calculatePrice(totalHours, parking.pricePerHour);

        // Generate unique booking code
        const bookingCode = generateBookingCode();

        // Create booking
        const booking = await Booking.create({
            userId,
            parkingId,
            slotId,
            startTime,
            endTime,
            totalHours,
            totalPrice,
            status: BOOKING_STATUS.PENDING,
            bookingCode
        }, { transaction });

        // Update slot status to RESERVED
        await slot.update({ status: SLOT_STATUS.RESERVED }, { transaction });

        await transaction.commit();

        // Fetch complete booking details
        const createdBooking = await Booking.findByPk(booking.id, {
            include: [
                { model: User, as: 'user', attributes: ['id', 'name', 'email', 'phone'] },
                { model: Parking, as: 'parking' },
                { model: ParkingSlot, as: 'slot' }
            ]
        });

        return createdBooking;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

/**
 * Get booking by ID
 * @param {number} bookingId 
 * @returns {Object} Booking details
 */
const getBookingById = async (bookingId) => {
    const booking = await Booking.findByPk(bookingId, {
        include: [
            { model: User, as: 'user', attributes: ['id', 'name', 'email', 'phone'] },
            { model: Parking, as: 'parking' },
            { model: ParkingSlot, as: 'slot' }
        ]
    });

    if (!booking) {
        throw new AppError(ERROR_MESSAGES.BOOKING_NOT_FOUND, 404);
    }

    return booking;
};

/**
 * Get user's bookings
 * @param {number} userId 
 * @param {Object} filters - Status filter
 * @returns {Array} User bookings
 */
const getUserBookings = async (userId, filters = {}) => {
    const where = { userId };

    if (filters.status) {
        where.status = filters.status;
    }

    const bookings = await Booking.findAll({
        where,
        include: [
            { model: Parking, as: 'parking' },
            { model: ParkingSlot, as: 'slot' }
        ],
        order: [['createdAt', 'DESC']]
    });

    return bookings;
};

/**
 * Cancel booking
 * @param {number} bookingId 
 * @param {number} userId 
 * @returns {Object} Cancelled booking
 */
const cancelBooking = async (bookingId, userId) => {
    const transaction = await sequelize.transaction();

    try {
        const booking = await Booking.findByPk(bookingId, {
            include: [{ model: ParkingSlot, as: 'slot' }],
            lock: transaction.LOCK.UPDATE,
            transaction
        });

        if (!booking) {
            throw new AppError(ERROR_MESSAGES.BOOKING_NOT_FOUND, 404);
        }

        // Check ownership
        if (booking.userId !== userId) {
            throw new AppError('Unauthorized to cancel this booking', 403);
        }

        // Check if booking can be cancelled
        if (!booking.canBeCancelled()) {
            throw new AppError(ERROR_MESSAGES.CANNOT_CANCEL_ACTIVE, 400);
        }

        // Cancel booking
        await booking.update({ status: BOOKING_STATUS.CANCELLED }, { transaction });

        // Release slot
        await booking.slot.update({ status: SLOT_STATUS.AVAILABLE }, { transaction });

        await transaction.commit();

        return await getBookingById(bookingId);
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

/**
 * Confirm booking (after payment)
 * @param {number} bookingId 
 * @returns {Object} Confirmed booking
 */
const confirmBooking = async (bookingId) => {
    const booking = await Booking.findByPk(bookingId);

    if (!booking) {
        throw new AppError(ERROR_MESSAGES.BOOKING_NOT_FOUND, 404);
    }

    if (booking.status !== BOOKING_STATUS.PENDING) {
        throw new AppError('Booking is not in pending status', 400);
    }

    await booking.update({ status: BOOKING_STATUS.CONFIRMED });

    return await getBookingById(bookingId);
};

/**
 * Activate booking (when user arrives)
 * @param {number} bookingId 
 * @returns {Object} Activated booking
 */
const activateBooking = async (bookingId) => {
    const transaction = await sequelize.transaction();

    try {
        const booking = await Booking.findByPk(bookingId, {
            include: [{ model: ParkingSlot, as: 'slot' }],
            transaction
        });

        if (!booking) {
            throw new AppError(ERROR_MESSAGES.BOOKING_NOT_FOUND, 404);
        }

        if (booking.status !== BOOKING_STATUS.CONFIRMED) {
            throw new AppError('Booking must be confirmed first', 400);
        }

        // Check if current time is within booking time
        const now = new Date();
        if (now < new Date(booking.startTime)) {
            throw new AppError('Booking start time has not arrived yet', 400);
        }

        await booking.update({ status: BOOKING_STATUS.ACTIVE }, { transaction });
        await booking.slot.update({ status: SLOT_STATUS.OCCUPIED }, { transaction });

        await transaction.commit();

        return await getBookingById(bookingId);
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

/**
 * Complete booking (when user leaves)
 * @param {number} bookingId 
 * @returns {Object} Completed booking
 */
const completeBooking = async (bookingId) => {
    const transaction = await sequelize.transaction();

    try {
        const booking = await Booking.findByPk(bookingId, {
            include: [{ model: ParkingSlot, as: 'slot' }],
            transaction
        });

        if (!booking) {
            throw new AppError(ERROR_MESSAGES.BOOKING_NOT_FOUND, 404);
        }

        await booking.update({ status: BOOKING_STATUS.COMPLETED }, { transaction });
        await booking.slot.update({ status: SLOT_STATUS.AVAILABLE }, { transaction });

        await transaction.commit();

        return await getBookingById(bookingId);
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

/**
 * Check slot availability for a time range
 * @param {number} slotId 
 * @param {Date} startTime 
 * @param {Date} endTime 
 * @returns {boolean} Is available
 */
const checkSlotAvailability = async (slotId, startTime, endTime) => {
    const overlappingBooking = await Booking.findOne({
        where: {
            slotId,
            status: {
                [Op.notIn]: [BOOKING_STATUS.CANCELLED, BOOKING_STATUS.COMPLETED]
            },
            [Op.or]: [
                {
                    startTime: { [Op.lte]: startTime },
                    endTime: { [Op.gt]: startTime }
                },
                {
                    startTime: { [Op.lt]: endTime },
                    endTime: { [Op.gte]: endTime }
                },
                {
                    startTime: { [Op.gte]: startTime },
                    endTime: { [Op.lte]: endTime }
                }
            ]
        }
    });

    return !overlappingBooking;
};

module.exports = {
    createBooking,
    getBookingById,
    getUserBookings,
    cancelBooking,
    confirmBooking,
    activateBooking,
    completeBooking,
    checkSlotAvailability
};

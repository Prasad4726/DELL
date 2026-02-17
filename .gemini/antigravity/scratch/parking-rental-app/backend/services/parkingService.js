const { Parking, ParkingSlot, User, Review, sequelize } = require('../models');
const { PARKING_TYPES, SLOT_STATUS, ERROR_MESSAGES } = require('../utils/constants');
const { AppError } = require('../middlewares/errorMiddleware');
const geoService = require('./geoService');

/**
 * Parking Service
 * Handles parking location management and search
 */

/**
 * Create a new parking location
 * @param {number} ownerId - Owner user ID
 * @param {Object} parkingData - Parking details
 * @returns {Object} Created parking
 */
const createParking = async (ownerId, parkingData) => {
    const {
        name,
        address,
        latitude,
        longitude,
        pricePerHour,
        type,
        totalSlots,
        description,
        amenities
    } = parkingData;

    // Validate coordinates
    if (!geoService.validateCoordinates(latitude, longitude)) {
        throw new AppError('Invalid coordinates', 400);
    }

    // Start transaction
    const transaction = await sequelize.transaction();

    try {
        // Create parking
        const parking = await Parking.create({
            ownerId,
            name,
            address,
            latitude,
            longitude,
            pricePerHour,
            type: type || PARKING_TYPES.PRIVATE,
            totalSlots,
            description,
            amenities: amenities || []
        }, { transaction });

        // Create parking slots
        const slots = [];
        for (let i = 1; i <= totalSlots; i++) {
            slots.push({
                parkingId: parking.id,
                slotNumber: `S${i.toString().padStart(3, '0')}`,
                status: SLOT_STATUS.AVAILABLE
            });
        }

        await ParkingSlot.bulkCreate(slots, { transaction });

        await transaction.commit();

        // Fetch parking with slots
        const createdParking = await Parking.findByPk(parking.id, {
            include: [
                { model: ParkingSlot, as: 'slots' },
                { model: User, as: 'owner', attributes: ['id', 'name', 'email', 'phone'] }
            ]
        });

        return createdParking;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

/**
 * Get parking by ID
 * @param {number} parkingId 
 * @returns {Object} Parking details
 */
const getParkingById = async (parkingId) => {
    const parking = await Parking.findByPk(parkingId, {
        include: [
            { model: User, as: 'owner', attributes: ['id', 'name', 'phone'] },
            { model: ParkingSlot, as: 'slots' }
        ]
    });

    if (!parking) {
        throw new AppError(ERROR_MESSAGES.PARKING_NOT_FOUND, 404);
    }

    // Get available slots count
    const availableSlots = await parking.getAvailableSlots();

    // Get average rating
    const ratingData = await Review.getAverageRating(parkingId);

    return {
        ...parking.toJSON(),
        availableSlots,
        ...ratingData
    };
};

/**
 * Search nearby parkings
 * @param {number} latitude 
 * @param {number} longitude 
 * @param {number} radius 
 * @param {Object} filters 
 * @returns {Array} Nearby parkings
 */
const searchNearby = async (latitude, longitude, radius = 5000, filters = {}) => {
    const parkings = await geoService.findNearbyParkings(
        latitude,
        longitude,
        radius,
        filters
    );

    return parkings;
};

/**
 * Update parking
 * @param {number} parkingId 
 * @param {number} ownerId 
 * @param {Object} updateData 
 * @returns {Object} Updated parking
 */
const updateParking = async (parkingId, ownerId, updateData) => {
    const parking = await Parking.findByPk(parkingId);

    if (!parking) {
        throw new AppError(ERROR_MESSAGES.PARKING_NOT_FOUND, 404);
    }

    // Check ownership
    if (parking.ownerId !== ownerId) {
        throw new AppError(ERROR_MESSAGES.UNAUTHORIZED_PARKING_ACCESS, 403);
    }

    // Update parking
    await parking.update(updateData);

    return await getParkingById(parkingId);
};

/**
 * Delete parking
 * @param {number} parkingId 
 * @param {number} ownerId 
 */
const deleteParking = async (parkingId, ownerId) => {
    const parking = await Parking.findByPk(parkingId);

    if (!parking) {
        throw new AppError(ERROR_MESSAGES.PARKING_NOT_FOUND, 404);
    }

    // Check ownership
    if (parking.ownerId !== ownerId) {
        throw new AppError(ERROR_MESSAGES.UNAUTHORIZED_PARKING_ACCESS, 403);
    }

    await parking.destroy();
};

/**
 * Get owner's parkings
 * @param {number} ownerId 
 * @returns {Array} Owner's parkings
 */
const getOwnerParkings = async (ownerId) => {
    const parkings = await Parking.findAll({
        where: { ownerId },
        include: [
            { model: ParkingSlot, as: 'slots' }
        ],
        order: [['createdAt', 'DESC']]
    });

    // Add available slots count to each parking
    const parkingsWithAvailability = await Promise.all(
        parkings.map(async (parking) => {
            const availableSlots = await parking.getAvailableSlots();
            return {
                ...parking.toJSON(),
                availableSlots
            };
        })
    );

    return parkingsWithAvailability;
};

/**
 * Get available slots for a parking
 * @param {number} parkingId 
 * @returns {Array} Available slots
 */
const getAvailableSlots = async (parkingId) => {
    const parking = await Parking.findByPk(parkingId);

    if (!parking) {
        throw new AppError(ERROR_MESSAGES.PARKING_NOT_FOUND, 404);
    }

    const slots = await ParkingSlot.findAll({
        where: {
            parkingId,
            status: SLOT_STATUS.AVAILABLE
        }
    });

    return slots;
};

module.exports = {
    createParking,
    getParkingById,
    searchNearby,
    updateParking,
    deleteParking,
    getOwnerParkings,
    getAvailableSlots
};

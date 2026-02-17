const parkingService = require('../services/parkingService');
const { SUCCESS_MESSAGES } = require('../utils/constants');
const { successResponse } = require('../utils/helpers');

/**
 * Parking Controller
 * Handles parking location management endpoints
 */

/**
 * Create a new parking location
 * POST /api/parkings
 */
const createParking = async (req, res, next) => {
    try {
        const parking = await parkingService.createParking(req.user.id, req.body);

        res.status(201).json(
            successResponse(SUCCESS_MESSAGES.PARKING_CREATED, parking)
        );
    } catch (error) {
        next(error);
    }
};

/**
 * Get parking by ID
 * GET /api/parkings/:id
 */
const getParkingById = async (req, res, next) => {
    try {
        const parking = await parkingService.getParkingById(req.params.id);

        res.status(200).json(
            successResponse('Parking retrieved successfully', parking)
        );
    } catch (error) {
        next(error);
    }
};

/**
 * Search nearby parkings
 * GET /api/parkings/nearby
 */
const searchNearby = async (req, res, next) => {
    try {
        const { latitude, longitude, radius, type } = req.query;

        const parkings = await parkingService.searchNearby(
            parseFloat(latitude),
            parseFloat(longitude),
            radius ? parseInt(radius) : 5000,
            { type }
        );

        res.status(200).json(
            successResponse('Nearby parkings retrieved successfully', {
                count: parkings.length,
                parkings
            })
        );
    } catch (error) {
        next(error);
    }
};

/**
 * Update parking
 * PUT /api/parkings/:id
 */
const updateParking = async (req, res, next) => {
    try {
        const parking = await parkingService.updateParking(
            req.params.id,
            req.user.id,
            req.body
        );

        res.status(200).json(
            successResponse(SUCCESS_MESSAGES.PARKING_UPDATED, parking)
        );
    } catch (error) {
        next(error);
    }
};

/**
 * Delete parking
 * DELETE /api/parkings/:id
 */
const deleteParking = async (req, res, next) => {
    try {
        await parkingService.deleteParking(req.params.id, req.user.id);

        res.status(200).json(
            successResponse(SUCCESS_MESSAGES.PARKING_DELETED)
        );
    } catch (error) {
        next(error);
    }
};

/**
 * Get owner's parkings
 * GET /api/parkings/owner/me
 */
const getMyParkings = async (req, res, next) => {
    try {
        const parkings = await parkingService.getOwnerParkings(req.user.id);

        res.status(200).json(
            successResponse('Parkings retrieved successfully', {
                count: parkings.length,
                parkings
            })
        );
    } catch (error) {
        next(error);
    }
};

/**
 * Get available slots for a parking
 * GET /api/parkings/:id/slots
 */
const getAvailableSlots = async (req, res, next) => {
    try {
        const slots = await parkingService.getAvailableSlots(req.params.id);

        res.status(200).json(
            successResponse('Available slots retrieved successfully', {
                count: slots.length,
                slots
            })
        );
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createParking,
    getParkingById,
    searchNearby,
    updateParking,
    deleteParking,
    getMyParkings,
    getAvailableSlots
};

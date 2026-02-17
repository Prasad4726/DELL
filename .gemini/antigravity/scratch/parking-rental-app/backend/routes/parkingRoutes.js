const express = require('express');
const router = express.Router();
const parkingController = require('../controllers/parkingController');
const { authenticate } = require('../middlewares/authMiddleware');
const { isOwnerOrAdmin } = require('../middlewares/roleMiddleware');
const { validate } = require('../middlewares/validationMiddleware');
const {
    createParkingValidator,
    updateParkingValidator,
    nearbyParkingValidator
} = require('../utils/validators');

/**
 * Parking Routes
 * Base path: /api/parkings
 */

// Public routes
router.get('/nearby', nearbyParkingValidator, validate, parkingController.searchNearby);
router.get('/:id', parkingController.getParkingById);
router.get('/:id/slots', parkingController.getAvailableSlots);

// Protected routes (Owner/Admin only)
router.post(
    '/',
    authenticate,
    isOwnerOrAdmin,
    createParkingValidator,
    validate,
    parkingController.createParking
);

router.put(
    '/:id',
    authenticate,
    isOwnerOrAdmin,
    updateParkingValidator,
    validate,
    parkingController.updateParking
);

router.delete(
    '/:id',
    authenticate,
    isOwnerOrAdmin,
    parkingController.deleteParking
);

router.get(
    '/owner/me',
    authenticate,
    isOwnerOrAdmin,
    parkingController.getMyParkings
);

module.exports = router;

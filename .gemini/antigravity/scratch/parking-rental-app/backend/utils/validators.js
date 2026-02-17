const { body, param, query, validationResult } = require('express-validator');
const { USER_ROLES, PARKING_TYPES, PAYMENT_METHODS } = require('./constants');

/**
 * Validation schemas for all endpoints
 */

// Auth Validators
const registerValidator = [
    body('name')
        .trim()
        .notEmpty().withMessage('Name is required')
        .isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters'),
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email format')
        .normalizeEmail(),
    body('phone')
        .trim()
        .notEmpty().withMessage('Phone is required')
        .matches(/^[+]?[\d\s-()]+$/).withMessage('Invalid phone format'),
    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('role')
        .optional()
        .isIn(Object.values(USER_ROLES)).withMessage('Invalid role')
];

const loginValidator = [
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email format')
        .normalizeEmail(),
    body('password')
        .notEmpty().withMessage('Password is required')
];

// Parking Validators
const createParkingValidator = [
    body('name')
        .trim()
        .notEmpty().withMessage('Parking name is required')
        .isLength({ max: 200 }).withMessage('Name too long'),
    body('address')
        .trim()
        .notEmpty().withMessage('Address is required'),
    body('latitude')
        .notEmpty().withMessage('Latitude is required')
        .isFloat({ min: -90, max: 90 }).withMessage('Invalid latitude'),
    body('longitude')
        .notEmpty().withMessage('Longitude is required')
        .isFloat({ min: -180, max: 180 }).withMessage('Invalid longitude'),
    body('pricePerHour')
        .notEmpty().withMessage('Price per hour is required')
        .isFloat({ min: 0 }).withMessage('Price must be positive'),
    body('type')
        .optional()
        .isIn(Object.values(PARKING_TYPES)).withMessage('Invalid parking type'),
    body('totalSlots')
        .notEmpty().withMessage('Total slots is required')
        .isInt({ min: 1 }).withMessage('Must have at least 1 slot'),
    body('description')
        .optional()
        .trim(),
    body('amenities')
        .optional()
        .isArray().withMessage('Amenities must be an array')
];

const updateParkingValidator = [
    param('id').isInt().withMessage('Invalid parking ID'),
    body('name').optional().trim().isLength({ max: 200 }),
    body('address').optional().trim(),
    body('pricePerHour').optional().isFloat({ min: 0 }),
    body('description').optional().trim(),
    body('amenities').optional().isArray(),
    body('isActive').optional().isBoolean()
];

const nearbyParkingValidator = [
    query('latitude')
        .notEmpty().withMessage('Latitude is required')
        .isFloat({ min: -90, max: 90 }).withMessage('Invalid latitude'),
    query('longitude')
        .notEmpty().withMessage('Longitude is required')
        .isFloat({ min: -180, max: 180 }).withMessage('Invalid longitude'),
    query('radius')
        .optional()
        .isInt({ min: 100, max: 50000 }).withMessage('Radius must be 100-50000 meters'),
    query('type')
        .optional()
        .isIn(Object.values(PARKING_TYPES)).withMessage('Invalid parking type')
];

// Booking Validators
const createBookingValidator = [
    body('parkingId')
        .notEmpty().withMessage('Parking ID is required')
        .isInt().withMessage('Invalid parking ID'),
    body('slotId')
        .notEmpty().withMessage('Slot ID is required')
        .isInt().withMessage('Invalid slot ID'),
    body('startTime')
        .notEmpty().withMessage('Start time is required')
        .isISO8601().withMessage('Invalid start time format'),
    body('endTime')
        .notEmpty().withMessage('End time is required')
        .isISO8601().withMessage('Invalid end time format')
];

const cancelBookingValidator = [
    param('id').isInt().withMessage('Invalid booking ID')
];

// Payment Validators
const createPaymentValidator = [
    body('bookingId')
        .notEmpty().withMessage('Booking ID is required')
        .isInt().withMessage('Invalid booking ID'),
    body('paymentMethod')
        .notEmpty().withMessage('Payment method is required')
        .isIn(Object.values(PAYMENT_METHODS)).withMessage('Invalid payment method')
];

// Review Validators
const createReviewValidator = [
    body('parkingId')
        .notEmpty().withMessage('Parking ID is required')
        .isInt().withMessage('Invalid parking ID'),
    body('bookingId')
        .optional()
        .isInt().withMessage('Invalid booking ID'),
    body('rating')
        .notEmpty().withMessage('Rating is required')
        .isInt({ min: 1, max: 5 }).withMessage('Rating must be 1-5'),
    body('comment')
        .optional()
        .trim()
        .isLength({ max: 500 }).withMessage('Comment too long')
];

/**
 * Middleware to handle validation errors
 */
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation error',
            errors: errors.array().map(err => ({
                field: err.param,
                message: err.msg
            }))
        });
    }
    next();
};

module.exports = {
    registerValidator,
    loginValidator,
    createParkingValidator,
    updateParkingValidator,
    nearbyParkingValidator,
    createBookingValidator,
    cancelBookingValidator,
    createPaymentValidator,
    createReviewValidator,
    validate
};

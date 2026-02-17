/**
 * Application Constants
 */

// User Roles
const USER_ROLES = {
    USER: 'USER',
    OWNER: 'OWNER',
    ADMIN: 'ADMIN'
};

// Parking Types
const PARKING_TYPES = {
    PUBLIC: 'PUBLIC',
    PRIVATE: 'PRIVATE'
};

// Parking Slot Status
const SLOT_STATUS = {
    AVAILABLE: 'AVAILABLE',
    OCCUPIED: 'OCCUPIED',
    RESERVED: 'RESERVED',
    MAINTENANCE: 'MAINTENANCE'
};

// Booking Status
const BOOKING_STATUS = {
    PENDING: 'PENDING',
    CONFIRMED: 'CONFIRMED',
    ACTIVE: 'ACTIVE',
    COMPLETED: 'COMPLETED',
    CANCELLED: 'CANCELLED'
};

// Payment Status
const PAYMENT_STATUS = {
    PENDING: 'PENDING',
    SUCCESS: 'SUCCESS',
    FAILED: 'FAILED',
    REFUNDED: 'REFUNDED'
};

// Payment Methods
const PAYMENT_METHODS = {
    CARD: 'CARD',
    UPI: 'UPI',
    WALLET: 'WALLET',
    CASH: 'CASH'
};

// Error Messages
const ERROR_MESSAGES = {
    // Authentication
    INVALID_CREDENTIALS: 'Invalid email or password',
    EMAIL_EXISTS: 'Email already registered',
    PHONE_EXISTS: 'Phone number already registered',
    UNAUTHORIZED: 'Unauthorized access',
    TOKEN_INVALID: 'Invalid or expired token',

    // User
    USER_NOT_FOUND: 'User not found',

    // Parking
    PARKING_NOT_FOUND: 'Parking location not found',
    PARKING_INACTIVE: 'Parking location is not active',
    UNAUTHORIZED_PARKING_ACCESS: 'You do not have permission to modify this parking',

    // Slot
    SLOT_NOT_FOUND: 'Parking slot not found',
    SLOT_NOT_AVAILABLE: 'Parking slot is not available',
    NO_SLOTS_AVAILABLE: 'No parking slots available',

    // Booking
    BOOKING_NOT_FOUND: 'Booking not found',
    BOOKING_OVERLAP: 'Slot is already booked for the selected time',
    INVALID_BOOKING_TIME: 'Invalid booking time range',
    BOOKING_PAST_TIME: 'Cannot book for past time',
    BOOKING_ALREADY_CANCELLED: 'Booking is already cancelled',
    CANNOT_CANCEL_ACTIVE: 'Cannot cancel active or completed booking',

    // Payment
    PAYMENT_NOT_FOUND: 'Payment not found',
    PAYMENT_FAILED: 'Payment processing failed',

    // General
    VALIDATION_ERROR: 'Validation error',
    SERVER_ERROR: 'Internal server error',
    NOT_FOUND: 'Resource not found'
};

// Success Messages
const SUCCESS_MESSAGES = {
    USER_CREATED: 'User registered successfully',
    LOGIN_SUCCESS: 'Login successful',
    PARKING_CREATED: 'Parking location created successfully',
    PARKING_UPDATED: 'Parking location updated successfully',
    PARKING_DELETED: 'Parking location deleted successfully',
    BOOKING_CREATED: 'Booking created successfully',
    BOOKING_CANCELLED: 'Booking cancelled successfully',
    PAYMENT_SUCCESS: 'Payment completed successfully',
    REVIEW_CREATED: 'Review submitted successfully'
};

// Pagination
const PAGINATION = {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 20,
    MAX_LIMIT: 100
};

// Geolocation
const GEO = {
    DEFAULT_RADIUS: 5000, // 5km in meters
    MAX_RADIUS: 50000, // 50km in meters
    EARTH_RADIUS_KM: 6371
};

module.exports = {
    USER_ROLES,
    PARKING_TYPES,
    SLOT_STATUS,
    BOOKING_STATUS,
    PAYMENT_STATUS,
    PAYMENT_METHODS,
    ERROR_MESSAGES,
    SUCCESS_MESSAGES,
    PAGINATION,
    GEO
};

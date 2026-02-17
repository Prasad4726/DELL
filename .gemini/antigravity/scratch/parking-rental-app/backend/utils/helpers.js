const crypto = require('crypto');

/**
 * Helper utility functions
 */

/**
 * Generate unique booking code
 * Format: BK-YYYYMMDD-XXXXX
 */
const generateBookingCode = () => {
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
    const random = crypto.randomBytes(3).toString('hex').toUpperCase();
    return `BK-${dateStr}-${random}`;
};

/**
 * Calculate hours between two dates
 * @param {Date} startTime 
 * @param {Date} endTime 
 * @returns {number} Hours (rounded to 2 decimals)
 */
const calculateHours = (startTime, endTime) => {
    const diffMs = new Date(endTime) - new Date(startTime);
    const hours = diffMs / (1000 * 60 * 60);
    return Math.round(hours * 100) / 100;
};

/**
 * Calculate total price based on hours and hourly rate
 * @param {number} hours 
 * @param {number} pricePerHour 
 * @returns {number} Total price (rounded to 2 decimals)
 */
const calculatePrice = (hours, pricePerHour) => {
    const price = hours * pricePerHour;
    return Math.round(price * 100) / 100;
};

/**
 * Check if a time range is valid (end > start and not in past)
 * @param {Date} startTime 
 * @param {Date} endTime 
 * @returns {boolean}
 */
const isValidTimeRange = (startTime, endTime) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const now = new Date();

    return start < end && start >= now;
};

/**
 * Format date to readable string
 * @param {Date} date 
 * @returns {string}
 */
const formatDate = (date) => {
    return new Date(date).toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

/**
 * Calculate distance between two coordinates using Haversine formula
 * @param {number} lat1 
 * @param {number} lon1 
 * @param {number} lat2 
 * @param {number} lon2 
 * @returns {number} Distance in meters
 */
const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) *
        Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return Math.round(R * c);
};

/**
 * Sanitize user input to prevent XSS
 * @param {string} input 
 * @returns {string}
 */
const sanitizeInput = (input) => {
    if (typeof input !== 'string') return input;
    return input.replace(/[<>]/g, '');
};

/**
 * Generate pagination metadata
 * @param {number} page 
 * @param {number} limit 
 * @param {number} total 
 * @returns {object}
 */
const getPaginationMeta = (page, limit, total) => {
    const totalPages = Math.ceil(total / limit);
    return {
        currentPage: page,
        totalPages,
        totalItems: total,
        itemsPerPage: limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
    };
};

/**
 * Create success response format
 * @param {string} message 
 * @param {any} data 
 * @returns {object}
 */
const successResponse = (message, data = null) => {
    return {
        success: true,
        message,
        data
    };
};

/**
 * Create error response format
 * @param {string} message 
 * @param {any} errors 
 * @returns {object}
 */
const errorResponse = (message, errors = null) => {
    return {
        success: false,
        message,
        errors
    };
};

module.exports = {
    generateBookingCode,
    calculateHours,
    calculatePrice,
    isValidTimeRange,
    formatDate,
    calculateDistance,
    sanitizeInput,
    getPaginationMeta,
    successResponse,
    errorResponse
};

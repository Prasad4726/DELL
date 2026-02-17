import moment from 'moment';

/**
 * Helper utility functions for React Native app
 */

/**
 * Format currency
 * @param {number} amount 
 * @returns {string}
 */
export const formatCurrency = (amount) => {
    return `₹${parseFloat(amount).toFixed(2)}`;
};

/**
 * Format date
 * @param {string|Date} date 
 * @param {string} format 
 * @returns {string}
 */
export const formatDate = (date, format = 'DD MMM YYYY, hh:mm A') => {
    return moment(date).format(format);
};

/**
 * Calculate hours between dates
 * @param {Date} startTime 
 * @param {Date} endTime 
 * @returns {number}
 */
export const calculateHours = (startTime, endTime) => {
    const duration = moment.duration(moment(endTime).diff(moment(startTime)));
    return Math.round(duration.asHours() * 100) / 100;
};

/**
 * Calculate price
 * @param {number} hours 
 * @param {number} pricePerHour 
 * @returns {number}
 */
export const calculatePrice = (hours, pricePerHour) => {
    return Math.round(hours * pricePerHour * 100) / 100;
};

/**
 * Format distance
 * @param {number} meters 
 * @returns {string}
 */
export const formatDistance = (meters) => {
    if (meters < 1000) {
        return `${Math.round(meters)}m`;
    }
    return `${(meters / 1000).toFixed(1)}km`;
};

/**
 * Validate email
 * @param {string} email 
 * @returns {boolean}
 */
export const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};

/**
 * Validate phone
 * @param {string} phone 
 * @returns {boolean}
 */
export const validatePhone = (phone) => {
    const re = /^[+]?[\d\s-()]{10,}$/;
    return re.test(phone);
};

/**
 * Get booking status color
 * @param {string} status 
 * @returns {string}
 */
export const getBookingStatusColor = (status) => {
    const colors = {
        PENDING: '#F39C12',
        CONFIRMED: '#3498DB',
        ACTIVE: '#27AE60',
        COMPLETED: '#95A5A6',
        CANCELLED: '#E74C3C'
    };
    return colors[status] || '#95A5A6';
};

/**
 * Get payment status color
 * @param {string} status 
 * @returns {string}
 */
export const getPaymentStatusColor = (status) => {
    const colors = {
        PENDING: '#F39C12',
        SUCCESS: '#27AE60',
        FAILED: '#E74C3C',
        REFUNDED: '#3498DB'
    };
    return colors[status] || '#95A5A6';
};

/**
 * Truncate text
 * @param {string} text 
 * @param {number} maxLength 
 * @returns {string}
 */
export const truncateText = (text, maxLength = 50) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return `${text.substring(0, maxLength)}...`;
};

/**
 * Get initials from name
 * @param {string} name 
 * @returns {string}
 */
export const getInitials = (name) => {
    if (!name) return '';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

/**
 * Debounce function
 * @param {Function} func 
 * @param {number} wait 
 * @returns {Function}
 */
export const debounce = (func, wait = 300) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

export default {
    formatCurrency,
    formatDate,
    calculateHours,
    calculatePrice,
    formatDistance,
    validateEmail,
    validatePhone,
    getBookingStatusColor,
    getPaymentStatusColor,
    truncateText,
    getInitials,
    debounce
};

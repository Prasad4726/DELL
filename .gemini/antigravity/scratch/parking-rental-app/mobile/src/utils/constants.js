/**
 * Application Constants
 */

// API Configuration
export const API_CONFIG = {
    BASE_URL: 'http://localhost:5000/api/v1',
    TIMEOUT: 30000
};

// User Roles
export const USER_ROLES = {
    USER: 'USER',
    OWNER: 'OWNER',
    ADMIN: 'ADMIN'
};

// Booking Status
export const BOOKING_STATUS = {
    PENDING: 'PENDING',
    CONFIRMED: 'CONFIRMED',
    ACTIVE: 'ACTIVE',
    COMPLETED: 'COMPLETED',
    CANCELLED: 'CANCELLED'
};

// Payment Status
export const PAYMENT_STATUS = {
    PENDING: 'PENDING',
    SUCCESS: 'SUCCESS',
    FAILED: 'FAILED',
    REFUNDED: 'REFUNDED'
};

// Payment Methods
export const PAYMENT_METHODS = {
    CARD: 'CARD',
    UPI: 'UPI',
    WALLET: 'WALLET',
    CASH: 'CASH'
};

// Parking Types
export const PARKING_TYPES = {
    PUBLIC: 'PUBLIC',
    PRIVATE: 'PRIVATE'
};

// Slot Status
export const SLOT_STATUS = {
    AVAILABLE: 'AVAILABLE',
    OCCUPIED: 'OCCUPIED',
    MAINTENANCE: 'MAINTENANCE'
};

// Map Configuration
export const MAP_CONFIG = {
    DEFAULT_LATITUDE: 28.6139, // Delhi
    DEFAULT_LONGITUDE: 77.2090,
    DEFAULT_ZOOM: 15,
    SEARCH_RADIUS: 5000 // 5km in meters
};

// Colors
export const COLORS = {
    primary: '#4A90E2',
    primaryLight: '#E3F2FD',
    secondary: '#50C878',
    danger: '#E74C3C',
    error: '#E74C3C',
    warning: '#F39C12',
    warningLight: '#FFF3E0',
    success: '#27AE60',
    dark: '#2C3E50',
    light: '#ECF0F1',
    white: '#FFFFFF',
    black: '#000000',
    gray: '#95A5A6',
    lightGray: '#BDC3C7',
    background: '#F5F5F5',
    text: '#2C3E50',
    textLight: '#7F8C8D',
    border: '#E0E0E0'
};

// Spacing
export const SPACING = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32
};

// Fonts
export const FONTS = {
    regular: 'System',
    medium: 'System',
    bold: 'System',
    light: 'System'
};

// Sizes
export const SIZES = {
    base: 8,
    font: 14,
    radius: 8,
    padding: 16,
    margin: 16
};

// Error Messages
export const ERROR_MESSAGES = {
    NETWORK_ERROR: 'Network error. Please check your connection.',
    INVALID_CREDENTIALS: 'Invalid email or password',
    REQUIRED_FIELD: 'This field is required',
    INVALID_EMAIL: 'Please enter a valid email',
    INVALID_PHONE: 'Please enter a valid phone number',
    PASSWORD_MIN_LENGTH: 'Password must be at least 6 characters',
    LOCATION_PERMISSION: 'Location permission is required',
    BOOKING_FAILED: 'Failed to create booking',
    PAYMENT_FAILED: 'Payment processing failed'
};

// Success Messages
export const SUCCESS_MESSAGES = {
    LOGIN_SUCCESS: 'Login successful',
    REGISTER_SUCCESS: 'Registration successful',
    BOOKING_CREATED: 'Booking created successfully',
    BOOKING_CANCELLED: 'Booking cancelled successfully',
    PAYMENT_SUCCESS: 'Payment completed successfully',
    REVIEW_SUBMITTED: 'Review submitted successfully'
};

export default {
    API_CONFIG,
    USER_ROLES,
    BOOKING_STATUS,
    PAYMENT_STATUS,
    PAYMENT_METHODS,
    PARKING_TYPES,
    MAP_CONFIG,
    COLORS,
    FONTS,
    SIZES,
    ERROR_MESSAGES,
    SUCCESS_MESSAGES
};

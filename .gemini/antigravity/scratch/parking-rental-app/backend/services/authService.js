const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt');
const { User } = require('../models');
const { ERROR_MESSAGES, SUCCESS_MESSAGES } = require('../utils/constants');
const { AppError } = require('../middlewares/errorMiddleware');

/**
 * Authentication Service
 * Handles user registration, login, and token management
 */

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @returns {Object} User and token
 */
const register = async (userData) => {
    const { name, email, phone, password, role } = userData;

    // Check if email already exists
    const existingEmail = await User.findOne({ where: { email } });
    if (existingEmail) {
        throw new AppError(ERROR_MESSAGES.EMAIL_EXISTS, 409);
    }

    // Check if phone already exists
    const existingPhone = await User.findOne({ where: { phone } });
    if (existingPhone) {
        throw new AppError(ERROR_MESSAGES.PHONE_EXISTS, 409);
    }

    // Create user
    const user = await User.create({
        name,
        email,
        phone,
        password,
        role: role || 'USER'
    });

    // Generate token
    const token = generateToken(user.id);

    return {
        user,
        token
    };
};

/**
 * Login user
 * @param {string} email 
 * @param {string} password 
 * @returns {Object} User and token
 */
const login = async (email, password) => {
    // Find user by email
    const user = await User.findOne({ where: { email } });

    if (!user) {
        throw new AppError(ERROR_MESSAGES.INVALID_CREDENTIALS, 401);
    }

    // Check if user is active
    if (!user.isActive) {
        throw new AppError('Account is deactivated', 403);
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
        throw new AppError(ERROR_MESSAGES.INVALID_CREDENTIALS, 401);
    }

    // Generate token
    const token = generateToken(user.id);

    return {
        user,
        token
    };
};

/**
 * Generate JWT token
 * @param {number} userId 
 * @returns {string} JWT token
 */
const generateToken = (userId) => {
    return jwt.sign(
        { userId },
        jwtConfig.secret,
        {
            expiresIn: jwtConfig.expiresIn,
            issuer: jwtConfig.options.issuer,
            audience: jwtConfig.options.audience
        }
    );
};

/**
 * Verify JWT token
 * @param {string} token 
 * @returns {Object} Decoded token
 */
const verifyToken = (token) => {
    try {
        return jwt.verify(token, jwtConfig.secret);
    } catch (error) {
        throw new AppError(ERROR_MESSAGES.TOKEN_INVALID, 401);
    }
};

/**
 * Get user profile
 * @param {number} userId 
 * @returns {Object} User profile
 */
const getProfile = async (userId) => {
    const user = await User.findByPk(userId);

    if (!user) {
        throw new AppError(ERROR_MESSAGES.USER_NOT_FOUND, 404);
    }

    return user;
};

module.exports = {
    register,
    login,
    generateToken,
    verifyToken,
    getProfile
};

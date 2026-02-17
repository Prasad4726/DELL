const authService = require('../services/authService');
const { SUCCESS_MESSAGES } = require('../utils/constants');
const { successResponse, errorResponse } = require('../utils/helpers');

/**
 * Authentication Controller
 * Handles user registration and login endpoints
 */

/**
 * Register a new user
 * POST /api/auth/register
 */
const register = async (req, res, next) => {
    try {
        const { name, email, phone, password, role } = req.body;

        const result = await authService.register({
            name,
            email,
            phone,
            password,
            role
        });

        res.status(201).json(
            successResponse(SUCCESS_MESSAGES.USER_CREATED, {
                user: result.user,
                token: result.token
            })
        );
    } catch (error) {
        next(error);
    }
};

/**
 * Login user
 * POST /api/auth/login
 */
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const result = await authService.login(email, password);

        res.status(200).json(
            successResponse(SUCCESS_MESSAGES.LOGIN_SUCCESS, {
                user: result.user,
                token: result.token
            })
        );
    } catch (error) {
        next(error);
    }
};

/**
 * Get current user profile
 * GET /api/auth/profile
 */
const getProfile = async (req, res, next) => {
    try {
        const user = await authService.getProfile(req.user.id);

        res.status(200).json(
            successResponse('Profile retrieved successfully', user)
        );
    } catch (error) {
        next(error);
    }
};

/**
 * Refresh token
 * POST /api/auth/refresh
 */
const refreshToken = async (req, res, next) => {
    try {
        const token = authService.generateToken(req.user.id);

        res.status(200).json(
            successResponse('Token refreshed successfully', { token })
        );
    } catch (error) {
        next(error);
    }
};

module.exports = {
    register,
    login,
    getProfile,
    refreshToken
};

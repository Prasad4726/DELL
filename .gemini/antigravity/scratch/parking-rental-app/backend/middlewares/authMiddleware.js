const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt');
const { User } = require('../models');
const { ERROR_MESSAGES } = require('../utils/constants');
const { errorResponse } = require('../utils/helpers');

/**
 * Authentication Middleware
 * Verifies JWT token and attaches user to request
 */
const authenticate = async (req, res, next) => {
    try {
        // Get token from header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json(
                errorResponse(ERROR_MESSAGES.UNAUTHORIZED)
            );
        }

        const token = authHeader.substring(7); // Remove 'Bearer ' prefix

        // Verify token
        const decoded = jwt.verify(token, jwtConfig.secret);

        // Find user
        const user = await User.findByPk(decoded.userId);

        if (!user || !user.isActive) {
            return res.status(401).json(
                errorResponse(ERROR_MESSAGES.USER_NOT_FOUND)
            );
        }

        // Attach user to request
        req.user = user;
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json(
                errorResponse(ERROR_MESSAGES.TOKEN_INVALID)
            );
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json(
                errorResponse('Token has expired')
            );
        }
        return res.status(500).json(
            errorResponse(ERROR_MESSAGES.SERVER_ERROR)
        );
    }
};

/**
 * Optional authentication middleware
 * Attaches user if token is present, but doesn't fail if not
 */
const optionalAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.substring(7);
            const decoded = jwt.verify(token, jwtConfig.secret);
            const user = await User.findByPk(decoded.userId);

            if (user && user.isActive) {
                req.user = user;
            }
        }
        next();
    } catch (error) {
        // Continue without authentication
        next();
    }
};

module.exports = { authenticate, optionalAuth };

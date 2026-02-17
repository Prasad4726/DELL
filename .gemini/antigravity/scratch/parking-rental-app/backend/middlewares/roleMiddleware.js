const { USER_ROLES, ERROR_MESSAGES } = require('../utils/constants');
const { errorResponse } = require('../utils/helpers');

/**
 * Role-based access control middleware
 */

/**
 * Check if user has required role
 * @param  {...string} allowedRoles - Roles that are allowed to access
 */
const authorize = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json(
                errorResponse(ERROR_MESSAGES.UNAUTHORIZED)
            );
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json(
                errorResponse('Access denied. Insufficient permissions.')
            );
        }

        next();
    };
};

/**
 * Check if user is admin
 */
const isAdmin = authorize(USER_ROLES.ADMIN);

/**
 * Check if user is owner or admin
 */
const isOwnerOrAdmin = authorize(USER_ROLES.OWNER, USER_ROLES.ADMIN);

/**
 * Check if user is the resource owner or admin
 * Requires req.resourceOwnerId to be set
 */
const isResourceOwnerOrAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json(
            errorResponse(ERROR_MESSAGES.UNAUTHORIZED)
        );
    }

    const isOwner = req.resourceOwnerId && req.resourceOwnerId === req.user.id;
    const isAdmin = req.user.role === USER_ROLES.ADMIN;

    if (!isOwner && !isAdmin) {
        return res.status(403).json(
            errorResponse('Access denied. You do not have permission to access this resource.')
        );
    }

    next();
};

module.exports = {
    authorize,
    isAdmin,
    isOwnerOrAdmin,
    isResourceOwnerOrAdmin
};

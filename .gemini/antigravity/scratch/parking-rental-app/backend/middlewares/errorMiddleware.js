const { ERROR_MESSAGES } = require('../utils/constants');
const { errorResponse } = require('../utils/helpers');

/**
 * Error Handling Middleware
 * Centralized error handler for the application
 */

/**
 * 404 Not Found handler
 */
const notFound = (req, res, next) => {
    res.status(404).json(
        errorResponse(`Route ${req.originalUrl} not found`)
    );
};

/**
 * Global error handler
 */
const errorHandler = (err, req, res, next) => {
    // Log error for debugging
    console.error('Error:', err);

    // Sequelize validation errors
    if (err.name === 'SequelizeValidationError') {
        return res.status(400).json(
            errorResponse(
                'Validation error',
                err.errors.map(e => ({
                    field: e.path,
                    message: e.message
                }))
            )
        );
    }

    // Sequelize unique constraint errors
    if (err.name === 'SequelizeUniqueConstraintError') {
        return res.status(409).json(
            errorResponse(
                'Duplicate entry',
                err.errors.map(e => ({
                    field: e.path,
                    message: `${e.path} already exists`
                }))
            )
        );
    }

    // Sequelize foreign key constraint errors
    if (err.name === 'SequelizeForeignKeyConstraintError') {
        return res.status(400).json(
            errorResponse('Invalid reference to related resource')
        );
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json(
            errorResponse(ERROR_MESSAGES.TOKEN_INVALID)
        );
    }

    if (err.name === 'TokenExpiredError') {
        return res.status(401).json(
            errorResponse('Token has expired')
        );
    }

    // Custom application errors
    if (err.statusCode) {
        return res.status(err.statusCode).json(
            errorResponse(err.message, err.errors)
        );
    }

    // Default server error
    res.status(500).json(
        errorResponse(
            process.env.NODE_ENV === 'development'
                ? err.message
                : ERROR_MESSAGES.SERVER_ERROR
        )
    );
};

/**
 * Custom error class for application errors
 */
class AppError extends Error {
    constructor(message, statusCode = 500, errors = null) {
        super(message);
        this.statusCode = statusCode;
        this.errors = errors;
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = {
    notFound,
    errorHandler,
    AppError
};

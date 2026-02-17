const { validationResult } = require('express-validator');
const { errorResponse } = require('../utils/helpers');

/**
 * Validation Middleware
 * Handles validation errors from express-validator
 */
const validate = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json(
            errorResponse(
                'Validation error',
                errors.array().map(err => ({
                    field: err.param,
                    message: err.msg,
                    value: err.value
                }))
            )
        );
    }

    next();
};

module.exports = { validate };

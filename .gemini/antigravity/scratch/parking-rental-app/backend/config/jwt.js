require('dotenv').config();

/**
 * JWT Configuration
 */
module.exports = {
    secret: process.env.JWT_SECRET || 'your_jwt_secret_key_change_in_production',
    expiresIn: process.env.JWT_EXPIRE || '7d',

    // JWT options
    options: {
        issuer: 'parking-rental-api',
        audience: 'parking-rental-app'
    }
};

import api from './api';

/**
 * Authentication Service
 * Handles user authentication API calls
 */

/**
 * Register a new user
 * @param {Object} userData 
 * @returns {Promise}
 */
export const register = async (userData) => {
    return await api.post('/auth/register', userData);
};

/**
 * Login user
 * @param {string} email 
 * @param {string} password 
 * @returns {Promise}
 */
export const login = async (email, password) => {
    return await api.post('/auth/login', { email, password });
};

/**
 * Get user profile
 * @returns {Promise}
 */
export const getProfile = async () => {
    return await api.get('/auth/profile');
};

/**
 * Refresh token
 * @returns {Promise}
 */
export const refreshToken = async () => {
    return await api.post('/auth/refresh');
};

export default {
    register,
    login,
    getProfile,
    refreshToken
};

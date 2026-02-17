import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_CONFIG } from '../utils/constants';

/**
 * Axios instance configuration
 * Handles authentication tokens and error responses
 */

const api = axios.create({
    baseURL: API_CONFIG.BASE_URL,
    timeout: API_CONFIG.TIMEOUT,
    headers: {
        'Content-Type': 'application/json'
    }
});

/**
 * Request interceptor
 * Adds authentication token to requests
 */
api.interceptors.request.use(
    async (config) => {
        try {
            const token = await AsyncStorage.getItem('authToken');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        } catch (error) {
            console.error('Error getting auth token:', error);
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

/**
 * Response interceptor
 * Handles errors and token expiration
 */
api.interceptors.response.use(
    (response) => {
        return response.data;
    },
    async (error) => {
        if (error.response) {
            // Server responded with error status
            const { status, data } = error.response;

            if (status === 401) {
                // Token expired or invalid - clear storage and redirect to login
                await AsyncStorage.multiRemove(['authToken', 'user']);
                // Navigation will be handled by the app
            }

            // Return formatted error
            return Promise.reject({
                message: data.message || 'An error occurred',
                errors: data.errors || null,
                status
            });
        } else if (error.request) {
            // Request made but no response
            return Promise.reject({
                message: 'Network error. Please check your connection.',
                status: 0
            });
        } else {
            // Something else happened
            return Promise.reject({
                message: error.message || 'An unexpected error occurred',
                status: 0
            });
        }
    }
);

export default api;

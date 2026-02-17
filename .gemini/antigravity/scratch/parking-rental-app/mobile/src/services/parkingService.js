import api from './api';

/**
 * Parking Service
 * Handles parking-related API calls
 */

/**
 * Search nearby parkings
 * @param {number} latitude 
 * @param {number} longitude 
 * @param {number} radius 
 * @param {string} type 
 * @returns {Promise}
 */
export const searchNearby = async (latitude, longitude, radius = 5000, type = null) => {
    const params = { latitude, longitude, radius };
    if (type) params.type = type;
    return await api.get('/parkings/nearby', { params });
};

/**
 * Get parking by ID
 * @param {number} parkingId 
 * @returns {Promise}
 */
export const getParkingById = async (parkingId) => {
    return await api.get(`/parkings/${parkingId}`);
};

/**
 * Get available slots for parking
 * @param {number} parkingId 
 * @returns {Promise}
 */
export const getAvailableSlots = async (parkingId) => {
    return await api.get(`/parkings/${parkingId}/slots`);
};

/**
 * Create parking (Owner only)
 * @param {Object} parkingData 
 * @returns {Promise}
 */
export const createParking = async (parkingData) => {
    return await api.post('/parkings', parkingData);
};

/**
 * Update parking (Owner only)
 * @param {number} parkingId 
 * @param {Object} updateData 
 * @returns {Promise}
 */
export const updateParking = async (parkingId, updateData) => {
    return await api.put(`/parkings/${parkingId}`, updateData);
};

/**
 * Delete parking (Owner only)
 * @param {number} parkingId 
 * @returns {Promise}
 */
export const deleteParking = async (parkingId) => {
    return await api.delete(`/parkings/${parkingId}`);
};

/**
 * Get owner's parkings
 * @returns {Promise}
 */
export const getMyParkings = async () => {
    return await api.get('/parkings/owner/me');
};

export default {
    searchNearby,
    getParkingById,
    getAvailableSlots,
    createParking,
    updateParking,
    deleteParking,
    getMyParkings
};

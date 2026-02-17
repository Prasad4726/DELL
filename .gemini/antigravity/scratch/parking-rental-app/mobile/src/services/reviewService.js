import api from './api';

/**
 * Review Service
 * Handles review-related API calls
 */

const reviewService = {
    /**
     * Create a review for a parking location
     * @param {number} parkingId 
     * @param {number} rating 
     * @param {string} comment 
     * @returns {Promise}
     */
    createReview: async (parkingId, rating, comment) => {
        const response = await api.post('/reviews', {
            parkingId,
            rating,
            comment
        });
        return response.data;
    },

    /**
     * Get reviews for a parking location
     * @param {number} parkingId 
     * @returns {Promise}
     */
    getParkingReviews: async (parkingId) => {
        const response = await api.get(`/reviews/parking/${parkingId}`);
        return response.data;
    }
};

export default reviewService;

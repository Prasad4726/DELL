const { sequelize } = require('../config/database');

/**
 * Geolocation Service
 * Handles geospatial queries using PostGIS
 */

/**
 * Find nearby parkings using PostGIS
 * @param {number} latitude - User latitude
 * @param {number} longitude - User longitude
 * @param {number} radiusMeters - Search radius in meters
 * @param {Object} filters - Additional filters (type, availability)
 * @returns {Array} Nearby parkings with distance
 */
const findNearbyParkings = async (latitude, longitude, radiusMeters = 5000, filters = {}) => {
    const { type, minAvailableSlots } = filters;

    // Build WHERE clause
    let whereClause = 'p.is_active = true';

    if (type) {
        whereClause += ` AND p.type = '${type}'`;
    }

    // Raw SQL query using PostGIS ST_DWithin for efficient geospatial search
    const query = `
    SELECT 
      p.*,
      ST_Distance(
        p.location::geography,
        ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326)::geography
      ) as distance,
      (
        SELECT COUNT(*) 
        FROM parking_slots ps 
        WHERE ps.parking_id = p.id AND ps.status = 'AVAILABLE'
      ) as available_slots
    FROM parkings p
    WHERE ${whereClause}
      AND ST_DWithin(
        p.location::geography,
        ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326)::geography,
        :radius
      )
    ${minAvailableSlots ? 'HAVING available_slots >= :minAvailableSlots' : ''}
    ORDER BY distance ASC
    LIMIT 50
  `;

    const parkings = await sequelize.query(query, {
        replacements: {
            latitude,
            longitude,
            radius: radiusMeters,
            minAvailableSlots: minAvailableSlots || 0
        },
        type: sequelize.QueryTypes.SELECT
    });

    return parkings.map(parking => ({
        ...parking,
        distance: Math.round(parking.distance), // Round to nearest meter
        availableSlots: parseInt(parking.available_slots)
    }));
};

/**
 * Calculate distance between two coordinates
 * @param {number} lat1 
 * @param {number} lon1 
 * @param {number} lat2 
 * @param {number} lon2 
 * @returns {number} Distance in meters
 */
const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) *
        Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return Math.round(R * c);
};

/**
 * Validate coordinates
 * @param {number} latitude 
 * @param {number} longitude 
 * @returns {boolean}
 */
const validateCoordinates = (latitude, longitude) => {
    return (
        typeof latitude === 'number' &&
        typeof longitude === 'number' &&
        latitude >= -90 &&
        latitude <= 90 &&
        longitude >= -180 &&
        longitude <= 180
    );
};

module.exports = {
    findNearbyParkings,
    calculateDistance,
    validateCoordinates
};

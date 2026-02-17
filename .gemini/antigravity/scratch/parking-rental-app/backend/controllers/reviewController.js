const { Review, Parking } = require('../models');
const { SUCCESS_MESSAGES, ERROR_MESSAGES } = require('../utils/constants');
const { successResponse } = require('../utils/helpers');
const { AppError } = require('../middlewares/errorMiddleware');

/**
 * Review Controller
 * Handles parking reviews and ratings
 */

/**
 * Create a review
 * POST /api/reviews
 */
const createReview = async (req, res, next) => {
    try {
        const { parkingId, bookingId, rating, comment } = req.body;

        // Check if parking exists
        const parking = await Parking.findByPk(parkingId);
        if (!parking) {
            throw new AppError(ERROR_MESSAGES.PARKING_NOT_FOUND, 404);
        }

        // Create review
        const review = await Review.create({
            userId: req.user.id,
            parkingId,
            bookingId,
            rating,
            comment
        });

        res.status(201).json(
            successResponse(SUCCESS_MESSAGES.REVIEW_CREATED, review)
        );
    } catch (error) {
        next(error);
    }
};

/**
 * Get reviews for a parking
 * GET /api/reviews/parking/:parkingId
 */
const getParkingReviews = async (req, res, next) => {
    try {
        const { parkingId } = req.params;

        const reviews = await Review.findAll({
            where: { parkingId },
            include: [
                {
                    model: require('../models').User,
                    as: 'user',
                    attributes: ['id', 'name']
                }
            ],
            order: [['createdAt', 'DESC']]
        });

        // Get average rating
        const ratingData = await Review.getAverageRating(parkingId);

        res.status(200).json(
            successResponse('Reviews retrieved successfully', {
                ...ratingData,
                reviews
            })
        );
    } catch (error) {
        next(error);
    }
};

/**
 * Get user's reviews
 * GET /api/reviews/my
 */
const getMyReviews = async (req, res, next) => {
    try {
        const reviews = await Review.findAll({
            where: { userId: req.user.id },
            include: [
                {
                    model: Parking,
                    as: 'parking',
                    attributes: ['id', 'name', 'address']
                }
            ],
            order: [['createdAt', 'DESC']]
        });

        res.status(200).json(
            successResponse('Reviews retrieved successfully', {
                count: reviews.length,
                reviews
            })
        );
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createReview,
    getParkingReviews,
    getMyReviews
};

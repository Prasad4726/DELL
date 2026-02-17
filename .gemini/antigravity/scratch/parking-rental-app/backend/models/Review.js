const { DataTypes } = require('sequelize');

/**
 * Review Model
 * Represents user reviews and ratings for parking locations
 */
module.exports = (sequelize) => {
    const Review = sequelize.define('Review', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'user_id',
            references: {
                model: 'users',
                key: 'id'
            }
        },
        parkingId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'parking_id',
            references: {
                model: 'parkings',
                key: 'id'
            }
        },
        bookingId: {
            type: DataTypes.INTEGER,
            field: 'booking_id',
            references: {
                model: 'bookings',
                key: 'id'
            }
        },
        rating: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 1,
                max: 5
            }
        },
        comment: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    }, {
        tableName: 'reviews',
        timestamps: true,
        underscored: true,

        indexes: [
            {
                fields: ['parking_id']
            },
            {
                fields: ['user_id']
            },
            {
                fields: ['rating']
            },
            {
                unique: true,
                fields: ['user_id', 'booking_id']
            }
        ]
    });

    /**
     * Class method to calculate average rating for a parking
     */
    Review.getAverageRating = async function (parkingId) {
        const result = await this.findOne({
            where: { parkingId },
            attributes: [
                [sequelize.fn('AVG', sequelize.col('rating')), 'avgRating'],
                [sequelize.fn('COUNT', sequelize.col('id')), 'totalReviews']
            ],
            raw: true
        });

        return {
            averageRating: result.avgRating ? parseFloat(result.avgRating).toFixed(1) : 0,
            totalReviews: parseInt(result.totalReviews) || 0
        };
    };

    return Review;
};

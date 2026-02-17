const { DataTypes } = require('sequelize');
const { BOOKING_STATUS } = require('../utils/constants');

/**
 * Booking Model
 * Represents parking slot bookings with time-based reservations
 */
module.exports = (sequelize) => {
    const Booking = sequelize.define('Booking', {
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
        slotId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'slot_id',
            references: {
                model: 'parking_slots',
                key: 'id'
            }
        },
        startTime: {
            type: DataTypes.DATE,
            allowNull: false,
            field: 'start_time'
        },
        endTime: {
            type: DataTypes.DATE,
            allowNull: false,
            field: 'end_time',
            validate: {
                isAfterStart(value) {
                    if (value <= this.startTime) {
                        throw new Error('End time must be after start time');
                    }
                }
            }
        },
        totalHours: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            field: 'total_hours'
        },
        totalPrice: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            field: 'total_price'
        },
        status: {
            type: DataTypes.ENUM(Object.values(BOOKING_STATUS)),
            defaultValue: BOOKING_STATUS.PENDING,
            allowNull: false
        },
        bookingCode: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true,
            field: 'booking_code'
        }
    }, {
        tableName: 'bookings',
        timestamps: true,
        underscored: true,

        indexes: [
            {
                fields: ['user_id']
            },
            {
                fields: ['parking_id']
            },
            {
                fields: ['slot_id']
            },
            {
                fields: ['status']
            },
            {
                fields: ['start_time', 'end_time']
            },
            {
                unique: true,
                fields: ['booking_code']
            }
        ]
    });

    /**
     * Instance method to check if booking is active
     */
    Booking.prototype.isActive = function () {
        const now = new Date();
        return this.status === BOOKING_STATUS.ACTIVE &&
            now >= this.startTime &&
            now <= this.endTime;
    };

    /**
     * Instance method to check if booking can be cancelled
     */
    Booking.prototype.canBeCancelled = function () {
        return [BOOKING_STATUS.PENDING, BOOKING_STATUS.CONFIRMED].includes(this.status);
    };

    /**
     * Instance method to cancel booking
     */
    Booking.prototype.cancel = async function () {
        if (!this.canBeCancelled()) {
            throw new Error('Booking cannot be cancelled');
        }
        this.status = BOOKING_STATUS.CANCELLED;
        await this.save();
    };

    return Booking;
};

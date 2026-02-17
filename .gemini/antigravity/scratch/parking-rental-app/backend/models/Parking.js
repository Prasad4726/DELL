const { DataTypes } = require('sequelize');
const { PARKING_TYPES } = require('../utils/constants');

/**
 * Parking Model
 * Represents parking locations with geolocation support
 */
module.exports = (sequelize) => {
    const Parking = sequelize.define('Parking', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        ownerId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'owner_id',
            references: {
                model: 'users',
                key: 'id'
            }
        },
        name: {
            type: DataTypes.STRING(200),
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        address: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        latitude: {
            type: DataTypes.DECIMAL(10, 8),
            allowNull: false,
            validate: {
                min: -90,
                max: 90
            }
        },
        longitude: {
            type: DataTypes.DECIMAL(11, 8),
            allowNull: false,
            validate: {
                min: -180,
                max: 180
            }
        },
        pricePerHour: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            field: 'price_per_hour',
            validate: {
                min: 0
            }
        },
        type: {
            type: DataTypes.ENUM(Object.values(PARKING_TYPES)),
            defaultValue: PARKING_TYPES.PRIVATE,
            allowNull: false
        },
        totalSlots: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
            field: 'total_slots',
            validate: {
                min: 1
            }
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        amenities: {
            type: DataTypes.ARRAY(DataTypes.STRING),
            defaultValue: []
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
            field: 'is_active'
        }
    }, {
        tableName: 'parkings',
        timestamps: true,
        underscored: true,

        // Indexes for geolocation queries
        indexes: [
            {
                fields: ['owner_id']
            },
            {
                fields: ['type']
            },
            {
                fields: ['latitude', 'longitude']
            }
        ]
    });

    /**
     * Instance method to calculate available slots
     */
    Parking.prototype.getAvailableSlots = async function () {
        const ParkingSlot = sequelize.models.ParkingSlot;
        const { SLOT_STATUS } = require('../utils/constants');

        const availableCount = await ParkingSlot.count({
            where: {
                parkingId: this.id,
                status: SLOT_STATUS.AVAILABLE
            }
        });

        return availableCount;
    };

    return Parking;
};

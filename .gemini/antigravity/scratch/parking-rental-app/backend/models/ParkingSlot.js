const { DataTypes } = require('sequelize');
const { SLOT_STATUS } = require('../utils/constants');

/**
 * ParkingSlot Model
 * Represents individual parking slots within a parking location
 */
module.exports = (sequelize) => {
    const ParkingSlot = sequelize.define('ParkingSlot', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
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
        slotNumber: {
            type: DataTypes.STRING(20),
            allowNull: false,
            field: 'slot_number'
        },
        status: {
            type: DataTypes.ENUM(Object.values(SLOT_STATUS)),
            defaultValue: SLOT_STATUS.AVAILABLE,
            allowNull: false
        }
    }, {
        tableName: 'parking_slots',
        timestamps: true,
        underscored: true,

        // Unique constraint on parking_id + slot_number
        indexes: [
            {
                unique: true,
                fields: ['parking_id', 'slot_number']
            },
            {
                fields: ['status']
            }
        ]
    });

    /**
     * Instance method to check if slot is available
     */
    ParkingSlot.prototype.isAvailable = function () {
        return this.status === SLOT_STATUS.AVAILABLE;
    };

    /**
     * Instance method to reserve slot
     */
    ParkingSlot.prototype.reserve = async function () {
        this.status = SLOT_STATUS.RESERVED;
        await this.save();
    };

    /**
     * Instance method to occupy slot
     */
    ParkingSlot.prototype.occupy = async function () {
        this.status = SLOT_STATUS.OCCUPIED;
        await this.save();
    };

    /**
     * Instance method to release slot
     */
    ParkingSlot.prototype.release = async function () {
        this.status = SLOT_STATUS.AVAILABLE;
        await this.save();
    };

    return ParkingSlot;
};

const { sequelize } = require('../config/database');
const { DataTypes } = require('sequelize');

/**
 * Initialize all models and their associations
 */

// Import model definitions
const UserModel = require('./User');
const ParkingModel = require('./Parking');
const ParkingSlotModel = require('./ParkingSlot');
const BookingModel = require('./Booking');
const PaymentModel = require('./Payment');
const ReviewModel = require('./Review');

// Initialize models
const User = UserModel(sequelize);
const Parking = ParkingModel(sequelize);
const ParkingSlot = ParkingSlotModel(sequelize);
const Booking = BookingModel(sequelize);
const Payment = PaymentModel(sequelize);
const Review = ReviewModel(sequelize);

// ============================================
// MODEL ASSOCIATIONS
// ============================================

// User associations
User.hasMany(Parking, {
    foreignKey: 'ownerId',
    as: 'parkings',
    onDelete: 'CASCADE'
});

User.hasMany(Booking, {
    foreignKey: 'userId',
    as: 'bookings',
    onDelete: 'CASCADE'
});

User.hasMany(Review, {
    foreignKey: 'userId',
    as: 'reviews',
    onDelete: 'CASCADE'
});

// Parking associations
Parking.belongsTo(User, {
    foreignKey: 'ownerId',
    as: 'owner'
});

Parking.hasMany(ParkingSlot, {
    foreignKey: 'parkingId',
    as: 'slots',
    onDelete: 'CASCADE'
});

Parking.hasMany(Booking, {
    foreignKey: 'parkingId',
    as: 'bookings',
    onDelete: 'CASCADE'
});

Parking.hasMany(Review, {
    foreignKey: 'parkingId',
    as: 'reviews',
    onDelete: 'CASCADE'
});

// ParkingSlot associations
ParkingSlot.belongsTo(Parking, {
    foreignKey: 'parkingId',
    as: 'parking'
});

ParkingSlot.hasMany(Booking, {
    foreignKey: 'slotId',
    as: 'bookings',
    onDelete: 'CASCADE'
});

// Booking associations
Booking.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user'
});

Booking.belongsTo(Parking, {
    foreignKey: 'parkingId',
    as: 'parking'
});

Booking.belongsTo(ParkingSlot, {
    foreignKey: 'slotId',
    as: 'slot'
});

Booking.hasOne(Payment, {
    foreignKey: 'bookingId',
    as: 'payment',
    onDelete: 'CASCADE'
});

Booking.hasOne(Review, {
    foreignKey: 'bookingId',
    as: 'review',
    onDelete: 'SET NULL'
});

// Payment associations
Payment.belongsTo(Booking, {
    foreignKey: 'bookingId',
    as: 'booking'
});

// Review associations
Review.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user'
});

Review.belongsTo(Parking, {
    foreignKey: 'parkingId',
    as: 'parking'
});

Review.belongsTo(Booking, {
    foreignKey: 'bookingId',
    as: 'booking'
});

// Export all models
module.exports = {
    sequelize,
    User,
    Parking,
    ParkingSlot,
    Booking,
    Payment,
    Review
};

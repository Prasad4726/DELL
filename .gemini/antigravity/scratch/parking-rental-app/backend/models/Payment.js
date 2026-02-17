const { DataTypes } = require('sequelize');
const { PAYMENT_STATUS, PAYMENT_METHODS } = require('../utils/constants');

/**
 * Payment Model
 * Represents payment transactions for bookings
 */
module.exports = (sequelize) => {
    const Payment = sequelize.define('Payment', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        bookingId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'booking_id',
            references: {
                model: 'bookings',
                key: 'id'
            }
        },
        amount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            validate: {
                min: 0
            }
        },
        paymentMethod: {
            type: DataTypes.ENUM(Object.values(PAYMENT_METHODS)),
            defaultValue: PAYMENT_METHODS.CARD,
            allowNull: false,
            field: 'payment_method'
        },
        status: {
            type: DataTypes.ENUM(Object.values(PAYMENT_STATUS)),
            defaultValue: PAYMENT_STATUS.PENDING,
            allowNull: false
        },
        transactionId: {
            type: DataTypes.STRING(255),
            unique: true,
            field: 'transaction_id'
        },
        paymentGateway: {
            type: DataTypes.STRING(50),
            field: 'payment_gateway'
        },
        gatewayResponse: {
            type: DataTypes.TEXT,
            field: 'gateway_response'
        }
    }, {
        tableName: 'payments',
        timestamps: true,
        underscored: true,

        indexes: [
            {
                fields: ['booking_id']
            },
            {
                fields: ['status']
            },
            {
                unique: true,
                fields: ['transaction_id']
            }
        ]
    });

    /**
     * Instance method to mark payment as successful
     */
    Payment.prototype.markSuccess = async function (transactionId, gatewayResponse = null) {
        this.status = PAYMENT_STATUS.SUCCESS;
        this.transactionId = transactionId;
        if (gatewayResponse) {
            this.gatewayResponse = JSON.stringify(gatewayResponse);
        }
        await this.save();
    };

    /**
     * Instance method to mark payment as failed
     */
    Payment.prototype.markFailed = async function (gatewayResponse = null) {
        this.status = PAYMENT_STATUS.FAILED;
        if (gatewayResponse) {
            this.gatewayResponse = JSON.stringify(gatewayResponse);
        }
        await this.save();
    };

    /**
     * Instance method to process refund
     */
    Payment.prototype.refund = async function () {
        if (this.status !== PAYMENT_STATUS.SUCCESS) {
            throw new Error('Can only refund successful payments');
        }
        this.status = PAYMENT_STATUS.REFUNDED;
        await this.save();
    };

    return Payment;
};

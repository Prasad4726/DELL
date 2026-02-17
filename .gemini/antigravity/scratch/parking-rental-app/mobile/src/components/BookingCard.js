import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import moment from 'moment';
import { COLORS, SIZES, BOOKING_STATUS } from '../utils/constants';

/**
 * BookingCard Component
 * Display booking information in a card format
 */
const BookingCard = ({ booking, onPress }) => {
    const getStatusColor = (status) => {
        switch (status) {
            case BOOKING_STATUS.CONFIRMED:
                return COLORS.success;
            case BOOKING_STATUS.ACTIVE:
                return COLORS.primary;
            case BOOKING_STATUS.COMPLETED:
                return COLORS.gray;
            case BOOKING_STATUS.CANCELLED:
                return COLORS.danger;
            case BOOKING_STATUS.PENDING:
            default:
                return COLORS.warning;
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case BOOKING_STATUS.CONFIRMED:
                return 'check-circle';
            case BOOKING_STATUS.ACTIVE:
                return 'local-parking';
            case BOOKING_STATUS.COMPLETED:
                return 'done-all';
            case BOOKING_STATUS.CANCELLED:
                return 'cancel';
            case BOOKING_STATUS.PENDING:
            default:
                return 'schedule';
        }
    };

    const statusColor = getStatusColor(booking.status);

    return (
        <TouchableOpacity
            style={styles.card}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View style={styles.header}>
                <View style={styles.parkingInfo}>
                    <Text style={styles.parkingName} numberOfLines={1}>
                        {booking.parking?.name || 'Parking'}
                    </Text>
                    <Text style={styles.bookingCode}>#{booking.bookingCode}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: statusColor + '20' }]}>
                    <Icon name={getStatusIcon(booking.status)} size={14} color={statusColor} />
                    <Text style={[styles.statusText, { color: statusColor }]}>
                        {booking.status}
                    </Text>
                </View>
            </View>

            <View style={styles.timeContainer}>
                <View style={styles.timeRow}>
                    <Icon name="access-time" size={16} color={COLORS.textLight} />
                    <Text style={styles.timeLabel}>Start:</Text>
                    <Text style={styles.timeValue}>
                        {moment(booking.startTime).format('MMM DD, YYYY hh:mm A')}
                    </Text>
                </View>
                <View style={styles.timeRow}>
                    <Icon name="access-time" size={16} color={COLORS.textLight} />
                    <Text style={styles.timeLabel}>End:</Text>
                    <Text style={styles.timeValue}>
                        {moment(booking.endTime).format('MMM DD, YYYY hh:mm A')}
                    </Text>
                </View>
            </View>

            <View style={styles.footer}>
                <View style={styles.durationContainer}>
                    <Icon name="timer" size={16} color={COLORS.primary} />
                    <Text style={styles.duration}>{booking.totalHours} hours</Text>
                </View>
                <Text style={styles.price}>₹{booking.totalPrice}</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: COLORS.white,
        borderRadius: SIZES.radius,
        padding: 16,
        marginBottom: 12,
        elevation: 2,
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12
    },
    parkingInfo: {
        flex: 1,
        marginRight: 8
    },
    parkingName: {
        fontSize: 18,
        fontWeight: '600',
        color: COLORS.text,
        marginBottom: 4
    },
    bookingCode: {
        fontSize: 12,
        color: COLORS.textLight
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 12
    },
    statusText: {
        fontSize: 12,
        fontWeight: '600',
        marginLeft: 4
    },
    timeContainer: {
        marginBottom: 12
    },
    timeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6
    },
    timeLabel: {
        fontSize: 14,
        color: COLORS.textLight,
        marginLeft: 6,
        width: 40
    },
    timeValue: {
        fontSize: 14,
        color: COLORS.text,
        flex: 1
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: COLORS.light
    },
    durationContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    duration: {
        fontSize: 14,
        color: COLORS.primary,
        marginLeft: 6,
        fontWeight: '500'
    },
    price: {
        fontSize: 20,
        fontWeight: '700',
        color: COLORS.primary
    }
});

export default BookingCard;

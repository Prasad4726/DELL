import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Alert,
    TouchableOpacity
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import moment from 'moment';
import { useDispatch } from 'react-redux';
import { cancelBooking } from '../../store/slices/bookingSlice';
import bookingService from '../../services/bookingService';
import { LoadingSpinner, ErrorMessage, CustomButton } from '../../components';
import { COLORS, BOOKING_STATUS } from '../../utils/constants';

/**
 * BookingDetailsScreen
 * Display detailed booking information
 */
const BookingDetailsScreen = ({ route, navigation }) => {
    const { bookingId } = route.params;
    const dispatch = useDispatch();

    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        loadBookingDetails();
    }, [bookingId]);

    const loadBookingDetails = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await bookingService.getBookingById(bookingId);
            setBooking(response.data);
        } catch (err) {
            setError(err.message || 'Failed to load booking details');
        } finally {
            setLoading(false);
        }
    };

    const handleCancelBooking = () => {
        Alert.alert(
            'Cancel Booking',
            'Are you sure you want to cancel this booking?',
            [
                { text: 'No', style: 'cancel' },
                {
                    text: 'Yes, Cancel',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            setActionLoading(true);
                            await dispatch(cancelBooking(bookingId)).unwrap();
                            Alert.alert('Success', 'Booking cancelled successfully');
                            loadBookingDetails();
                        } catch (err) {
                            Alert.alert('Error', err.message || 'Failed to cancel booking');
                        } finally {
                            setActionLoading(false);
                        }
                    }
                }
            ]
        );
    };

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

    const canCancel = (booking) => {
        return booking.status === BOOKING_STATUS.PENDING ||
            booking.status === BOOKING_STATUS.CONFIRMED;
    };

    if (loading) {
        return <LoadingSpinner message="Loading booking details..." />;
    }

    if (error) {
        return <ErrorMessage message={error} onRetry={loadBookingDetails} />;
    }

    if (!booking) {
        return <ErrorMessage message="Booking not found" />;
    }

    const statusColor = getStatusColor(booking.status);

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                {/* Status Badge */}
                <View style={[styles.statusBanner, { backgroundColor: statusColor }]}>
                    <Icon name="info" size={24} color={COLORS.white} />
                    <Text style={styles.statusText}>
                        Booking {booking.status}
                    </Text>
                </View>

                {/* Booking Code */}
                <View style={styles.codeCard}>
                    <Text style={styles.codeLabel}>Booking Code</Text>
                    <Text style={styles.codeValue}>#{booking.bookingCode}</Text>
                    <Text style={styles.codeSubtext}>
                        Show this code at the parking entrance
                    </Text>
                </View>

                {/* Parking Details */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Parking Details</Text>
                    <View style={styles.card}>
                        <View style={styles.detailRow}>
                            <Icon name="local-parking" size={20} color={COLORS.primary} />
                            <View style={styles.detailContent}>
                                <Text style={styles.detailLabel}>Parking Name</Text>
                                <Text style={styles.detailValue}>
                                    {booking.parking?.name || 'N/A'}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.detailRow}>
                            <Icon name="location-on" size={20} color={COLORS.primary} />
                            <View style={styles.detailContent}>
                                <Text style={styles.detailLabel}>Address</Text>
                                <Text style={styles.detailValue}>
                                    {booking.parking?.address || 'N/A'}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.detailRow}>
                            <Icon name="garage" size={20} color={COLORS.primary} />
                            <View style={styles.detailContent}>
                                <Text style={styles.detailLabel}>Slot Number</Text>
                                <Text style={styles.detailValue}>
                                    {booking.slot?.slotNumber || 'N/A'}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Time Details */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Time Details</Text>
                    <View style={styles.card}>
                        <View style={styles.timeRow}>
                            <View style={styles.timeItem}>
                                <Icon name="login" size={20} color={COLORS.success} />
                                <Text style={styles.timeLabel}>Start Time</Text>
                                <Text style={styles.timeValue}>
                                    {moment(booking.startTime).format('MMM DD, YYYY')}
                                </Text>
                                <Text style={styles.timeHour}>
                                    {moment(booking.startTime).format('hh:mm A')}
                                </Text>
                            </View>

                            <View style={styles.timeDivider}>
                                <Icon name="arrow-forward" size={24} color={COLORS.gray} />
                            </View>

                            <View style={styles.timeItem}>
                                <Icon name="logout" size={20} color={COLORS.danger} />
                                <Text style={styles.timeLabel}>End Time</Text>
                                <Text style={styles.timeValue}>
                                    {moment(booking.endTime).format('MMM DD, YYYY')}
                                </Text>
                                <Text style={styles.timeHour}>
                                    {moment(booking.endTime).format('hh:mm A')}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.durationContainer}>
                            <Icon name="timer" size={20} color={COLORS.primary} />
                            <Text style={styles.durationText}>
                                Total Duration: {booking.totalHours} hours
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Payment Details */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Payment Details</Text>
                    <View style={styles.card}>
                        <View style={styles.paymentRow}>
                            <Text style={styles.paymentLabel}>Price per hour</Text>
                            <Text style={styles.paymentValue}>
                                ₹{booking.parking?.pricePerHour || 0}
                            </Text>
                        </View>

                        <View style={styles.paymentRow}>
                            <Text style={styles.paymentLabel}>Duration</Text>
                            <Text style={styles.paymentValue}>
                                {booking.totalHours} hours
                            </Text>
                        </View>

                        <View style={[styles.paymentRow, styles.totalRow]}>
                            <Text style={styles.totalLabel}>Total Amount</Text>
                            <Text style={styles.totalValue}>₹{booking.totalPrice}</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>

            {/* Action Buttons */}
            <View style={styles.footer}>
                {canCancel(booking) && (
                    <CustomButton
                        title="Cancel Booking"
                        onPress={handleCancelBooking}
                        variant="danger"
                        loading={actionLoading}
                        style={styles.actionButton}
                    />
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background
    },
    content: {
        paddingBottom: 100
    },
    statusBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        gap: 8
    },
    statusText: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.white
    },
    codeCard: {
        backgroundColor: COLORS.white,
        margin: 16,
        padding: 24,
        borderRadius: 12,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: COLORS.primary,
        borderStyle: 'dashed'
    },
    codeLabel: {
        fontSize: 12,
        color: COLORS.textLight,
        marginBottom: 8
    },
    codeValue: {
        fontSize: 32,
        fontWeight: '700',
        color: COLORS.primary,
        marginBottom: 8
    },
    codeSubtext: {
        fontSize: 12,
        color: COLORS.textLight,
        textAlign: 'center'
    },
    section: {
        marginBottom: 16,
        paddingHorizontal: 16
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: COLORS.text,
        marginBottom: 12
    },
    card: {
        backgroundColor: COLORS.white,
        borderRadius: 12,
        padding: 16
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 16
    },
    detailContent: {
        marginLeft: 12,
        flex: 1
    },
    detailLabel: {
        fontSize: 12,
        color: COLORS.textLight,
        marginBottom: 4
    },
    detailValue: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.text
    },
    timeRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16
    },
    timeItem: {
        flex: 1,
        alignItems: 'center'
    },
    timeDivider: {
        marginHorizontal: 16
    },
    timeLabel: {
        fontSize: 12,
        color: COLORS.textLight,
        marginTop: 8,
        marginBottom: 4
    },
    timeValue: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.text,
        textAlign: 'center'
    },
    timeHour: {
        fontSize: 16,
        fontWeight: '700',
        color: COLORS.primary,
        marginTop: 4
    },
    durationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: COLORS.light
    },
    durationText: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.primary,
        marginLeft: 8
    },
    paymentRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8
    },
    paymentLabel: {
        fontSize: 14,
        color: COLORS.textLight
    },
    paymentValue: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.text
    },
    totalRow: {
        marginTop: 8,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: COLORS.light
    },
    totalLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.text
    },
    totalValue: {
        fontSize: 24,
        fontWeight: '700',
        color: COLORS.primary
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: COLORS.white,
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: COLORS.light,
        elevation: 8,
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4
    },
    actionButton: {
        width: '100%'
    }
});

export default BookingDetailsScreen;

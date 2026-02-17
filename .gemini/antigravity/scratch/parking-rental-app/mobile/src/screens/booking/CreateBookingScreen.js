import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
    Platform
} from 'react-native';
import DateTimePicker from 'react-native-modal-datetime-picker';
import moment from 'moment';
import { useDispatch } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { createBooking } from '../store/slices/bookingSlice';
import { CustomButton, LoadingSpinner } from '../components';
import { COLORS, PAYMENT_METHODS } from '../utils/constants';

/**
 * CreateBookingScreen
 * Create a new parking booking
 */
const CreateBookingScreen = ({ route, navigation }) => {
    const { parking } = route.params;
    const dispatch = useDispatch();

    const [startTime, setStartTime] = useState(new Date());
    const [endTime, setEndTime] = useState(new Date(Date.now() + 2 * 60 * 60 * 1000)); // 2 hours later
    const [showStartPicker, setShowStartPicker] = useState(false);
    const [showEndPicker, setShowEndPicker] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS.CARD);
    const [loading, setLoading] = useState(false);

    const calculateDuration = () => {
        const diff = endTime - startTime;
        const hours = diff / (1000 * 60 * 60);
        return Math.max(0, hours).toFixed(1);
    };

    const calculatePrice = () => {
        const hours = parseFloat(calculateDuration());
        return (hours * parking.pricePerHour).toFixed(2);
    };

    const handleStartTimeConfirm = (date) => {
        setStartTime(date);
        setShowStartPicker(false);

        // Ensure end time is after start time
        if (date >= endTime) {
            setEndTime(new Date(date.getTime() + 2 * 60 * 60 * 1000));
        }
    };

    const handleEndTimeConfirm = (date) => {
        if (date <= startTime) {
            Alert.alert('Invalid Time', 'End time must be after start time');
            return;
        }
        setEndTime(date);
        setShowEndPicker(false);
    };

    const handleCreateBooking = async () => {
        // Validate times
        if (startTime < new Date()) {
            Alert.alert('Invalid Time', 'Start time cannot be in the past');
            return;
        }

        if (endTime <= startTime) {
            Alert.alert('Invalid Time', 'End time must be after start time');
            return;
        }

        const duration = parseFloat(calculateDuration());
        if (duration < 0.5) {
            Alert.alert('Invalid Duration', 'Minimum booking duration is 30 minutes');
            return;
        }

        try {
            setLoading(true);

            const bookingData = {
                parkingId: parking.id,
                slotId: parking.slots?.[0]?.id || 1, // Simplified: use first available slot
                startTime: startTime.toISOString(),
                endTime: endTime.toISOString()
            };

            await dispatch(createBooking(bookingData)).unwrap();

            Alert.alert(
                'Success',
                'Booking created successfully!',
                [
                    {
                        text: 'View Bookings',
                        onPress: () => navigation.navigate('Bookings')
                    }
                ]
            );
        } catch (err) {
            Alert.alert('Error', err.message || 'Failed to create booking');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <LoadingSpinner message="Creating booking..." />;
    }

    const duration = calculateDuration();
    const totalPrice = calculatePrice();

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            {/* Parking Info */}
            <View style={styles.parkingCard}>
                <Text style={styles.parkingName}>{parking.name}</Text>
                <Text style={styles.parkingAddress}>{parking.address}</Text>
                <View style={styles.priceContainer}>
                    <Text style={styles.priceLabel}>Price per hour:</Text>
                    <Text style={styles.priceValue}>₹{parking.pricePerHour}</Text>
                </View>
            </View>

            {/* Date & Time Selection */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Select Date & Time</Text>

                {/* Start Time */}
                <TouchableOpacity
                    style={styles.timeButton}
                    onPress={() => setShowStartPicker(true)}
                >
                    <View style={styles.timeLeft}>
                        <Icon name="schedule" size={24} color={COLORS.primary} />
                        <View style={styles.timeInfo}>
                            <Text style={styles.timeLabel}>Start Time</Text>
                            <Text style={styles.timeValue}>
                                {moment(startTime).format('MMM DD, YYYY hh:mm A')}
                            </Text>
                        </View>
                    </View>
                    <Icon name="chevron-right" size={24} color={COLORS.gray} />
                </TouchableOpacity>

                {/* End Time */}
                <TouchableOpacity
                    style={styles.timeButton}
                    onPress={() => setShowEndPicker(true)}
                >
                    <View style={styles.timeLeft}>
                        <Icon name="schedule" size={24} color={COLORS.danger} />
                        <View style={styles.timeInfo}>
                            <Text style={styles.timeLabel}>End Time</Text>
                            <Text style={styles.timeValue}>
                                {moment(endTime).format('MMM DD, YYYY hh:mm A')}
                            </Text>
                        </View>
                    </View>
                    <Icon name="chevron-right" size={24} color={COLORS.gray} />
                </TouchableOpacity>
            </View>

            {/* Payment Method */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Payment Method</Text>
                <View style={styles.paymentMethods}>
                    {Object.values(PAYMENT_METHODS).map((method) => (
                        <TouchableOpacity
                            key={method}
                            style={[
                                styles.paymentButton,
                                paymentMethod === method && styles.paymentButtonActive
                            ]}
                            onPress={() => setPaymentMethod(method)}
                        >
                            <Icon
                                name={
                                    method === PAYMENT_METHODS.CARD ? 'credit-card' :
                                        method === PAYMENT_METHODS.UPI ? 'payment' :
                                            method === PAYMENT_METHODS.WALLET ? 'account-balance-wallet' :
                                                'money'
                                }
                                size={24}
                                color={paymentMethod === method ? COLORS.primary : COLORS.gray}
                            />
                            <Text
                                style={[
                                    styles.paymentText,
                                    paymentMethod === method && styles.paymentTextActive
                                ]}
                            >
                                {method}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {/* Booking Summary */}
            <View style={styles.summaryCard}>
                <Text style={styles.sectionTitle}>Booking Summary</Text>

                <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Duration</Text>
                    <Text style={styles.summaryValue}>{duration} hours</Text>
                </View>

                <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Price per hour</Text>
                    <Text style={styles.summaryValue}>₹{parking.pricePerHour}</Text>
                </View>

                <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Payment Method</Text>
                    <Text style={styles.summaryValue}>{paymentMethod}</Text>
                </View>

                <View style={[styles.summaryRow, styles.totalRow]}>
                    <Text style={styles.totalLabel}>Total Amount</Text>
                    <Text style={styles.totalValue}>₹{totalPrice}</Text>
                </View>
            </View>

            {/* Confirm Button */}
            <CustomButton
                title="Confirm Booking"
                onPress={handleCreateBooking}
                style={styles.confirmButton}
            />

            {/* Date Time Pickers */}
            <DateTimePicker
                isVisible={showStartPicker}
                mode="datetime"
                onConfirm={handleStartTimeConfirm}
                onCancel={() => setShowStartPicker(false)}
                minimumDate={new Date()}
                date={startTime}
            />

            <DateTimePicker
                isVisible={showEndPicker}
                mode="datetime"
                onConfirm={handleEndTimeConfirm}
                onCancel={() => setShowEndPicker(false)}
                minimumDate={startTime}
                date={endTime}
            />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background
    },
    content: {
        padding: 16,
        paddingBottom: 32
    },
    parkingCard: {
        backgroundColor: COLORS.white,
        borderRadius: 12,
        padding: 16,
        marginBottom: 16
    },
    parkingName: {
        fontSize: 20,
        fontWeight: '700',
        color: COLORS.text,
        marginBottom: 4
    },
    parkingAddress: {
        fontSize: 14,
        color: COLORS.textLight,
        marginBottom: 12
    },
    priceContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: COLORS.light
    },
    priceLabel: {
        fontSize: 14,
        color: COLORS.textLight
    },
    priceValue: {
        fontSize: 20,
        fontWeight: '700',
        color: COLORS.primary
    },
    section: {
        marginBottom: 16
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: COLORS.text,
        marginBottom: 12
    },
    timeButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: COLORS.white,
        borderRadius: 12,
        padding: 16,
        marginBottom: 12
    },
    timeLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1
    },
    timeInfo: {
        marginLeft: 12,
        flex: 1
    },
    timeLabel: {
        fontSize: 12,
        color: COLORS.textLight,
        marginBottom: 4
    },
    timeValue: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.text
    },
    paymentMethods: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12
    },
    paymentButton: {
        flex: 1,
        minWidth: '45%',
        backgroundColor: COLORS.white,
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: COLORS.light
    },
    paymentButtonActive: {
        borderColor: COLORS.primary,
        backgroundColor: COLORS.primary + '10'
    },
    paymentText: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.gray,
        marginTop: 8
    },
    paymentTextActive: {
        color: COLORS.primary
    },
    summaryCard: {
        backgroundColor: COLORS.white,
        borderRadius: 12,
        padding: 16,
        marginBottom: 24
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8
    },
    summaryLabel: {
        fontSize: 14,
        color: COLORS.textLight
    },
    summaryValue: {
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
    confirmButton: {
        marginBottom: 16
    }
});

export default CreateBookingScreen;

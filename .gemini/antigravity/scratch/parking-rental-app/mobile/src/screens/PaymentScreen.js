import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
    ActivityIndicator
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { processPayment } from '../services/paymentService';
import { COLORS, SPACING } from '../utils/constants';
import CustomButton from '../components/CustomButton';

/**
 * Payment Screen
 * Handles payment method selection and processing
 */
const PaymentScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { bookingId, amount } = route.params;

    const [selectedMethod, setSelectedMethod] = useState('CARD');
    const [loading, setLoading] = useState(false);

    const paymentMethods = [
        { id: 'CARD', name: 'Credit/Debit Card', icon: 'credit-card' },
        { id: 'UPI', name: 'UPI', icon: 'account-balance' },
        { id: 'WALLET', name: 'Wallet', icon: 'account-balance-wallet' },
        { id: 'NETBANKING', name: 'Net Banking', icon: 'account-balance' }
    ];

    const handlePayment = async () => {
        try {
            setLoading(true);

            const paymentData = {
                bookingId,
                amount,
                method: selectedMethod
            };

            const response = await processPayment(paymentData);

            if (response.success) {
                Alert.alert(
                    'Payment Successful',
                    'Your booking has been confirmed!',
                    [
                        {
                            text: 'View Booking',
                            onPress: () => navigation.navigate('BookingDetails', { 
                                bookingId: response.data.bookingId 
                            })
                        }
                    ]
                );
            } else {
                Alert.alert('Payment Failed', response.message || 'Please try again');
            }
        } catch (error) {
            Alert.alert('Error', error.message || 'Payment processing failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.content}>
                {/* Amount Section */}
                <View style={styles.amountCard}>
                    <Text style={styles.amountLabel}>Total Amount</Text>
                    <Text style={styles.amountValue}>₹{amount.toFixed(2)}</Text>
                </View>

                {/* Payment Methods */}
                <Text style={styles.sectionTitle}>Select Payment Method</Text>
                {paymentMethods.map((method) => (
                    <TouchableOpacity
                        key={method.id}
                        style={[
                            styles.methodCard,
                            selectedMethod === method.id && styles.methodCardSelected
                        ]}
                        onPress={() => setSelectedMethod(method.id)}
                    >
                        <View style={styles.methodLeft}>
                            <Icon
                                name={method.icon}
                                size={24}
                                color={selectedMethod === method.id ? COLORS.primary : COLORS.text}
                            />
                            <Text
                                style={[
                                    styles.methodName,
                                    selectedMethod === method.id && styles.methodNameSelected
                                ]}
                            >
                                {method.name}
                            </Text>
                        </View>
                        {selectedMethod === method.id && (
                            <Icon name="check-circle" size={24} color={COLORS.primary} />
                        )}
                    </TouchableOpacity>
                ))}

                {/* Payment Button */}
                <CustomButton
                    title={loading ? 'Processing...' : `Pay ₹${amount.toFixed(2)}`}
                    onPress={handlePayment}
                    disabled={loading}
                    style={styles.payButton}
                />

                {loading && (
                    <ActivityIndicator
                        size="large"
                        color={COLORS.primary}
                        style={styles.loader}
                    />
                )}

                {/* Security Info */}
                <View style={styles.securityInfo}>
                    <Icon name="lock" size={16} color={COLORS.gray} />
                    <Text style={styles.securityText}>
                        Your payment is secure and encrypted
                    </Text>
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background
    },
    content: {
        padding: SPACING.md
    },
    amountCard: {
        backgroundColor: COLORS.primary,
        padding: SPACING.lg,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: SPACING.lg
    },
    amountLabel: {
        color: COLORS.white,
        fontSize: 14,
        marginBottom: SPACING.xs
    },
    amountValue: {
        color: COLORS.white,
        fontSize: 32,
        fontWeight: 'bold'
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: COLORS.text,
        marginBottom: SPACING.md
    },
    methodCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: COLORS.white,
        padding: SPACING.md,
        borderRadius: 8,
        marginBottom: SPACING.sm,
        borderWidth: 2,
        borderColor: COLORS.border
    },
    methodCardSelected: {
        borderColor: COLORS.primary,
        backgroundColor: COLORS.primaryLight
    },
    methodLeft: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    methodName: {
        fontSize: 16,
        color: COLORS.text,
        marginLeft: SPACING.md
    },
    methodNameSelected: {
        color: COLORS.primary,
        fontWeight: '600'
    },
    payButton: {
        marginTop: SPACING.lg,
        marginBottom: SPACING.md
    },
    loader: {
        marginVertical: SPACING.md
    },
    securityInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: SPACING.md
    },
    securityText: {
        fontSize: 12,
        color: COLORS.gray,
        marginLeft: SPACING.xs
    }
});

export default PaymentScreen;

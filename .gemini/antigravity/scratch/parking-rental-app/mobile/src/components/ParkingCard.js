import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS, SIZES } from '../utils/constants';

/**
 * ParkingCard Component
 * Display parking information in a card format
 */
const ParkingCard = ({ parking, onPress, distance }) => {
    const availableSlots = parking.totalSlots - (parking.occupiedSlots || 0);
    const isAvailable = availableSlots > 0;

    return (
        <TouchableOpacity
            style={styles.card}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View style={styles.header}>
                <View style={styles.titleContainer}>
                    <Text style={styles.name} numberOfLines={1}>
                        {parking.name}
                    </Text>
                    <View style={[
                        styles.typeBadge,
                        parking.type === 'PUBLIC' ? styles.publicBadge : styles.privateBadge
                    ]}>
                        <Text style={styles.typeText}>{parking.type}</Text>
                    </View>
                </View>
                <Text style={styles.price}>₹{parking.pricePerHour}/hr</Text>
            </View>

            <View style={styles.addressContainer}>
                <Icon name="location-on" size={16} color={COLORS.textLight} />
                <Text style={styles.address} numberOfLines={2}>
                    {parking.address}
                </Text>
            </View>

            <View style={styles.footer}>
                <View style={styles.slotsContainer}>
                    <Icon
                        name={isAvailable ? 'check-circle' : 'cancel'}
                        size={18}
                        color={isAvailable ? COLORS.success : COLORS.danger}
                    />
                    <Text style={[
                        styles.slotsText,
                        { color: isAvailable ? COLORS.success : COLORS.danger }
                    ]}>
                        {availableSlots} slots available
                    </Text>
                </View>
                {distance && (
                    <View style={styles.distanceContainer}>
                        <Icon name="navigation" size={16} color={COLORS.primary} />
                        <Text style={styles.distanceText}>{distance.toFixed(1)} km</Text>
                    </View>
                )}
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
        marginBottom: 8
    },
    titleContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 8
    },
    name: {
        fontSize: 18,
        fontWeight: '600',
        color: COLORS.text,
        flex: 1
    },
    typeBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        marginLeft: 8
    },
    publicBadge: {
        backgroundColor: COLORS.primary + '20'
    },
    privateBadge: {
        backgroundColor: COLORS.secondary + '20'
    },
    typeText: {
        fontSize: 10,
        fontWeight: '600',
        color: COLORS.text
    },
    price: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.primary
    },
    addressContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 12
    },
    address: {
        fontSize: 14,
        color: COLORS.textLight,
        marginLeft: 4,
        flex: 1
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    slotsContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    slotsText: {
        fontSize: 14,
        fontWeight: '500',
        marginLeft: 4
    },
    distanceContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    distanceText: {
        fontSize: 14,
        color: COLORS.primary,
        marginLeft: 4,
        fontWeight: '500'
    }
});

export default ParkingCard;

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Marker } from 'react-native-maps';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS } from '../utils/constants';

/**
 * Custom Map Marker Component
 * Displays parking location on map with availability indicator
 */
const ParkingMarker = ({ parking, onPress }) => {
    const hasAvailableSlots = parking.available_slots > 0;

    return (
        <Marker
            coordinate={{
                latitude: parking.latitude,
                longitude: parking.longitude
            }}
            onPress={() => onPress(parking)}
        >
            <View style={styles.markerContainer}>
                <View
                    style={[
                        styles.marker,
                        {
                            backgroundColor: hasAvailableSlots
                                ? COLORS.success
                                : COLORS.error
                        }
                    ]}
                >
                    <Icon
                        name="local-parking"
                        size={20}
                        color={COLORS.white}
                    />
                </View>
                {parking.available_slots > 0 && (
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>{parking.available_slots}</Text>
                    </View>
                )}
            </View>
        </Marker>
    );
};

const styles = StyleSheet.create({
    markerContainer: {
        alignItems: 'center'
    },
    marker: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 3,
        borderColor: COLORS.white,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4
    },
    badge: {
        position: 'absolute',
        top: -5,
        right: -5,
        backgroundColor: COLORS.primary,
        borderRadius: 10,
        minWidth: 20,
        height: 20,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 4,
        borderWidth: 2,
        borderColor: COLORS.white
    },
    badgeText: {
        color: COLORS.white,
        fontSize: 10,
        fontWeight: 'bold'
    }
});

export default ParkingMarker;

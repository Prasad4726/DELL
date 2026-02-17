import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { COLORS } from '../utils/constants';

/**
 * LoadingSpinner Component
 * Centered loading indicator with optional message
 */
const LoadingSpinner = ({ size = 'large', color = COLORS.primary, message }) => {
    return (
        <View style={styles.container}>
            <ActivityIndicator size={size} color={color} />
            {message && <Text style={styles.message}>{message}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.background
    },
    message: {
        marginTop: 12,
        fontSize: 14,
        color: COLORS.textLight
    }
});

export default LoadingSpinner;

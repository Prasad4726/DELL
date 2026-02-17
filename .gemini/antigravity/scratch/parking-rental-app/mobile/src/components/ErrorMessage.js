import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS } from '../utils/constants';
import CustomButton from './CustomButton';

/**
 * ErrorMessage Component
 * Display error messages with optional retry functionality
 */
const ErrorMessage = ({ message, onRetry }) => {
    return (
        <View style={styles.container}>
            <Icon name="error-outline" size={64} color={COLORS.danger} />
            <Text style={styles.message}>{message || 'Something went wrong'}</Text>
            {onRetry && (
                <CustomButton
                    title="Retry"
                    onPress={onRetry}
                    variant="primary"
                    style={styles.retryButton}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.background,
        padding: 24
    },
    message: {
        fontSize: 16,
        color: COLORS.text,
        textAlign: 'center',
        marginTop: 16,
        marginBottom: 24
    },
    retryButton: {
        minWidth: 120
    }
});

export default ErrorMessage;

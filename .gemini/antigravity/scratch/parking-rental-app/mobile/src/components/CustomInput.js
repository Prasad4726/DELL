import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { COLORS, SIZES } from '../utils/constants';

/**
 * CustomInput Component
 * Reusable text input with label and error display
 */
const CustomInput = ({
    label,
    value,
    onChangeText,
    placeholder,
    error,
    secureTextEntry = false,
    keyboardType = 'default',
    multiline = false,
    numberOfLines = 1,
    editable = true,
    style
}) => {
    return (
        <View style={[styles.container, style]}>
            {label && <Text style={styles.label}>{label}</Text>}
            <TextInput
                style={[
                    styles.input,
                    multiline && styles.multilineInput,
                    error && styles.inputError,
                    !editable && styles.inputDisabled
                ]}
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor={COLORS.gray}
                secureTextEntry={secureTextEntry}
                keyboardType={keyboardType}
                multiline={multiline}
                numberOfLines={numberOfLines}
                editable={editable}
                autoCapitalize="none"
            />
            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 16
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.text,
        marginBottom: 8
    },
    input: {
        borderWidth: 1,
        borderColor: COLORS.lightGray,
        borderRadius: SIZES.radius,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 16,
        color: COLORS.text,
        backgroundColor: COLORS.white
    },
    multilineInput: {
        minHeight: 100,
        textAlignVertical: 'top'
    },
    inputError: {
        borderColor: COLORS.danger
    },
    inputDisabled: {
        backgroundColor: COLORS.light,
        color: COLORS.gray
    },
    errorText: {
        fontSize: 12,
        color: COLORS.danger,
        marginTop: 4
    }
});

export default CustomInput;

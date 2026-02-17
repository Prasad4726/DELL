import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Alert,
    Platform
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { createParking, updateParking } from '../services/parkingService';
import { COLORS, SPACING, PARKING_TYPES } from '../utils/constants';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import PickerSelect from 'react-native-picker-select';

/**
 * Add/Edit Parking Screen
 * Form to create or update parking location
 */
const AddEditParkingScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { parkingId, parkingData } = route.params || {};
    const isEdit = !!parkingId;

    const [formData, setFormData] = useState({
        name: parkingData?.name || '',
        address: parkingData?.address || '',
        latitude: parkingData?.latitude?.toString() || '',
        longitude: parkingData?.longitude?.toString() || '',
        pricePerHour: parkingData?.price_per_hour?.toString() || '',
        totalSlots: parkingData?.total_slots?.toString() || '',
        type: parkingData?.type || 'PRIVATE',
        description: parkingData?.description || ''
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }

        if (!formData.address.trim()) {
            newErrors.address = 'Address is required';
        }

        const lat = parseFloat(formData.latitude);
        if (isNaN(lat) || lat < -90 || lat > 90) {
            newErrors.latitude = 'Valid latitude required (-90 to 90)';
        }

        const lng = parseFloat(formData.longitude);
        if (isNaN(lng) || lng < -180 || lng > 180) {
            newErrors.longitude = 'Valid longitude required (-180 to 180)';
        }

        const price = parseFloat(formData.pricePerHour);
        if (isNaN(price) || price <= 0) {
            newErrors.pricePerHour = 'Valid price required';
        }

        const slots = parseInt(formData.totalSlots);
        if (isNaN(slots) || slots <= 0) {
            newErrors.totalSlots = 'Valid number of slots required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            return;
        }

        try {
            setLoading(true);

            const parkingPayload = {
                name: formData.name.trim(),
                address: formData.address.trim(),
                latitude: parseFloat(formData.latitude),
                longitude: parseFloat(formData.longitude),
                price_per_hour: parseFloat(formData.pricePerHour),
                total_slots: parseInt(formData.totalSlots),
                type: formData.type,
                description: formData.description.trim()
            };

            let response;
            if (isEdit) {
                response = await updateParking(parkingId, parkingPayload);
            } else {
                response = await createParking(parkingPayload);
            }

            if (response.success) {
                Alert.alert(
                    'Success',
                    `Parking ${isEdit ? 'updated' : 'created'} successfully`,
                    [
                        {
                            text: 'OK',
                            onPress: () => navigation.goBack()
                        }
                    ]
                );
            }
        } catch (error) {
            Alert.alert('Error', error.message || 'Failed to save parking');
        } finally {
            setLoading(false);
        }
    };

    const updateField = (field, value) => {
        setFormData({ ...formData, [field]: value });
        if (errors[field]) {
            setErrors({ ...errors, [field]: null });
        }
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>
                    {isEdit ? 'Edit Parking' : 'Add New Parking'}
                </Text>

                <CustomInput
                    label="Parking Name *"
                    value={formData.name}
                    onChangeText={(value) => updateField('name', value)}
                    error={errors.name}
                    placeholder="e.g., Downtown Parking"
                />

                <CustomInput
                    label="Address *"
                    value={formData.address}
                    onChangeText={(value) => updateField('address', value)}
                    error={errors.address}
                    placeholder="Full address"
                    multiline
                />

                <View style={styles.row}>
                    <View style={styles.halfWidth}>
                        <CustomInput
                            label="Latitude *"
                            value={formData.latitude}
                            onChangeText={(value) => updateField('latitude', value)}
                            error={errors.latitude}
                            placeholder="e.g., 28.6139"
                            keyboardType="decimal-pad"
                        />
                    </View>
                    <View style={styles.halfWidth}>
                        <CustomInput
                            label="Longitude *"
                            value={formData.longitude}
                            onChangeText={(value) => updateField('longitude', value)}
                            error={errors.longitude}
                            placeholder="e.g., 77.2090"
                            keyboardType="decimal-pad"
                        />
                    </View>
                </View>

                <View style={styles.row}>
                    <View style={styles.halfWidth}>
                        <CustomInput
                            label="Price per Hour (₹) *"
                            value={formData.pricePerHour}
                            onChangeText={(value) => updateField('pricePerHour', value)}
                            error={errors.pricePerHour}
                            placeholder="e.g., 50"
                            keyboardType="decimal-pad"
                        />
                    </View>
                    <View style={styles.halfWidth}>
                        <CustomInput
                            label="Total Slots *"
                            value={formData.totalSlots}
                            onChangeText={(value) => updateField('totalSlots', value)}
                            error={errors.totalSlots}
                            placeholder="e.g., 20"
                            keyboardType="number-pad"
                        />
                    </View>
                </View>

                <View style={styles.pickerContainer}>
                    <Text style={styles.label}>Parking Type *</Text>
                    <PickerSelect
                        value={formData.type}
                        onValueChange={(value) => updateField('type', value)}
                        items={[
                            { label: 'Private', value: 'PRIVATE' },
                            { label: 'Public', value: 'PUBLIC' }
                        ]}
                        style={pickerSelectStyles}
                    />
                </View>

                <CustomInput
                    label="Description (Optional)"
                    value={formData.description}
                    onChangeText={(value) => updateField('description', value)}
                    placeholder="Additional details about the parking"
                    multiline
                    numberOfLines={3}
                />

                <CustomButton
                    title={loading ? 'Saving...' : isEdit ? 'Update Parking' : 'Add Parking'}
                    onPress={handleSubmit}
                    disabled={loading}
                    style={styles.submitButton}
                />
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
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: SPACING.lg
    },
    row: {
        flexDirection: 'row',
        gap: SPACING.md
    },
    halfWidth: {
        flex: 1
    },
    pickerContainer: {
        marginBottom: SPACING.md
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        color: COLORS.text,
        marginBottom: SPACING.xs
    },
    submitButton: {
        marginTop: SPACING.lg,
        marginBottom: SPACING.xl
    }
});

const pickerSelectStyles = {
    inputIOS: {
        fontSize: 16,
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 8,
        color: COLORS.text,
        backgroundColor: COLORS.white
    },
    inputAndroid: {
        fontSize: 16,
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 8,
        color: COLORS.text,
        backgroundColor: COLORS.white
    }
};

export default AddEditParkingScreen;

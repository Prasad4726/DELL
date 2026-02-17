import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Alert,
    TouchableOpacity
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../../store/slices/authSlice';
import { CustomButton, CustomInput } from '../../components';
import { COLORS, USER_ROLES, ERROR_MESSAGES } from '../../utils/constants';

/**
 * SignupScreen
 * User registration screen
 */
const SignupScreen = ({ navigation }) => {
    const dispatch = useDispatch();
    const { loading, error } = useSelector((state) => state.auth);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        role: USER_ROLES.USER
    });

    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = ERROR_MESSAGES.REQUIRED_FIELD;
        }

        if (!formData.email.trim()) {
            newErrors.email = ERROR_MESSAGES.REQUIRED_FIELD;
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = ERROR_MESSAGES.INVALID_EMAIL;
        }

        if (!formData.phone.trim()) {
            newErrors.phone = ERROR_MESSAGES.REQUIRED_FIELD;
        } else if (!/^\+?[\d\s-]{10,}$/.test(formData.phone)) {
            newErrors.phone = ERROR_MESSAGES.INVALID_PHONE;
        }

        if (!formData.password) {
            newErrors.password = ERROR_MESSAGES.REQUIRED_FIELD;
        } else if (formData.password.length < 6) {
            newErrors.password = ERROR_MESSAGES.PASSWORD_MIN_LENGTH;
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSignup = async () => {
        if (!validateForm()) {
            return;
        }

        try {
            const { confirmPassword, ...registerData } = formData;
            await dispatch(register(registerData)).unwrap();
            Alert.alert(
                'Success',
                'Registration successful! Please login.',
                [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
            );
        } catch (err) {
            Alert.alert('Error', err.message || 'Registration failed');
        }
    };

    const updateField = (field, value) => {
        setFormData({ ...formData, [field]: value });
        if (errors[field]) {
            setErrors({ ...errors, [field]: null });
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.header}>
                    <Text style={styles.title}>Create Account</Text>
                    <Text style={styles.subtitle}>Sign up to get started</Text>
                </View>

                <View style={styles.form}>
                    <CustomInput
                        label="Full Name"
                        value={formData.name}
                        onChangeText={(value) => updateField('name', value)}
                        placeholder="Enter your full name"
                        error={errors.name}
                    />

                    <CustomInput
                        label="Email"
                        value={formData.email}
                        onChangeText={(value) => updateField('email', value)}
                        placeholder="Enter your email"
                        keyboardType="email-address"
                        error={errors.email}
                    />

                    <CustomInput
                        label="Phone Number"
                        value={formData.phone}
                        onChangeText={(value) => updateField('phone', value)}
                        placeholder="+1234567890"
                        keyboardType="phone-pad"
                        error={errors.phone}
                    />

                    <CustomInput
                        label="Password"
                        value={formData.password}
                        onChangeText={(value) => updateField('password', value)}
                        placeholder="Enter password (min 6 characters)"
                        secureTextEntry
                        error={errors.password}
                    />

                    <CustomInput
                        label="Confirm Password"
                        value={formData.confirmPassword}
                        onChangeText={(value) => updateField('confirmPassword', value)}
                        placeholder="Re-enter password"
                        secureTextEntry
                        error={errors.confirmPassword}
                    />

                    <View style={styles.roleContainer}>
                        <Text style={styles.roleLabel}>I am a:</Text>
                        <View style={styles.roleButtons}>
                            <TouchableOpacity
                                style={[
                                    styles.roleButton,
                                    formData.role === USER_ROLES.USER && styles.roleButtonActive
                                ]}
                                onPress={() => updateField('role', USER_ROLES.USER)}
                            >
                                <Text
                                    style={[
                                        styles.roleButtonText,
                                        formData.role === USER_ROLES.USER && styles.roleButtonTextActive
                                    ]}
                                >
                                    User
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[
                                    styles.roleButton,
                                    formData.role === USER_ROLES.OWNER && styles.roleButtonActive
                                ]}
                                onPress={() => updateField('role', USER_ROLES.OWNER)}
                            >
                                <Text
                                    style={[
                                        styles.roleButtonText,
                                        formData.role === USER_ROLES.OWNER && styles.roleButtonTextActive
                                    ]}
                                >
                                    Parking Owner
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <CustomButton
                        title="Sign Up"
                        onPress={handleSignup}
                        loading={loading}
                        style={styles.signupButton}
                    />

                    <View style={styles.loginContainer}>
                        <Text style={styles.loginText}>Already have an account? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                            <Text style={styles.loginLink}>Login</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background
    },
    scrollContent: {
        flexGrow: 1,
        padding: 24
    },
    header: {
        marginTop: 40,
        marginBottom: 32
    },
    title: {
        fontSize: 32,
        fontWeight: '700',
        color: COLORS.text,
        marginBottom: 8
    },
    subtitle: {
        fontSize: 16,
        color: COLORS.textLight
    },
    form: {
        flex: 1
    },
    roleContainer: {
        marginBottom: 24
    },
    roleLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.text,
        marginBottom: 12
    },
    roleButtons: {
        flexDirection: 'row',
        gap: 12
    },
    roleButton: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: COLORS.lightGray,
        alignItems: 'center',
        backgroundColor: COLORS.white
    },
    roleButtonActive: {
        borderColor: COLORS.primary,
        backgroundColor: COLORS.primary + '10'
    },
    roleButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.gray
    },
    roleButtonTextActive: {
        color: COLORS.primary
    },
    signupButton: {
        marginTop: 8,
        marginBottom: 24
    },
    loginContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    loginText: {
        fontSize: 14,
        color: COLORS.textLight
    },
    loginLink: {
        fontSize: 14,
        color: COLORS.primary,
        fontWeight: '600'
    }
});

export default SignupScreen;

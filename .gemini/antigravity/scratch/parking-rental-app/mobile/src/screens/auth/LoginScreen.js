import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../store/slices/authSlice';
import { COLORS, SIZES } from '../../utils/constants';
import { validateEmail } from '../../utils/helpers';

/**
 * Login Screen
 */
const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();
    const { loading, error } = useSelector((state) => state.auth);

    const handleLogin = () => {
        // Validation
        if (!email || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        if (!validateEmail(email)) {
            Alert.alert('Error', 'Please enter a valid email');
            return;
        }

        dispatch(loginUser(email, password));
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <View style={styles.content}>
                <Text style={styles.title}>Welcome Back</Text>
                <Text style={styles.subtitle}>Sign in to continue</Text>

                <View style={styles.form}>
                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        autoCapitalize="none"
                    />

                    {error && <Text style={styles.errorText}>{error}</Text>}

                    <TouchableOpacity
                        style={styles.button}
                        onPress={handleLogin}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color={COLORS.white} />
                        ) : (
                            <Text style={styles.buttonText}>Login</Text>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.linkButton}
                        onPress={() => navigation.navigate('Signup')}
                    >
                        <Text style={styles.linkText}>
                            Don't have an account? <Text style={styles.linkTextBold}>Sign Up</Text>
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white
    },
    content: {
        flex: 1,
        padding: SIZES.padding * 2,
        justifyContent: 'center'
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: COLORS.dark,
        marginBottom: SIZES.margin / 2
    },
    subtitle: {
        fontSize: 16,
        color: COLORS.textLight,
        marginBottom: SIZES.margin * 3
    },
    form: {
        width: '100%'
    },
    input: {
        backgroundColor: COLORS.light,
        borderRadius: SIZES.radius,
        padding: SIZES.padding,
        marginBottom: SIZES.margin,
        fontSize: 16
    },
    button: {
        backgroundColor: COLORS.primary,
        borderRadius: SIZES.radius,
        padding: SIZES.padding,
        alignItems: 'center',
        marginTop: SIZES.margin
    },
    buttonText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: 'bold'
    },
    linkButton: {
        marginTop: SIZES.margin * 2,
        alignItems: 'center'
    },
    linkText: {
        color: COLORS.textLight,
        fontSize: 14
    },
    linkTextBold: {
        color: COLORS.primary,
        fontWeight: 'bold'
    },
    errorText: {
        color: COLORS.danger,
        fontSize: 14,
        marginBottom: SIZES.margin
    }
});

export default LoginScreen;

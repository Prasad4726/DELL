import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { logout } from '../store/slices/authSlice';
import { CustomButton } from '../components';
import { COLORS } from '../utils/constants';

/**
 * ProfileScreen
 * User profile and account management
 */
const ProfileScreen = ({ navigation }) => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { userBookings } = useSelector((state) => state.booking);

    const handleLogout = () => {
        Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Logout',
                    style: 'destructive',
                    onPress: () => dispatch(logout())
                }
            ]
        );
    };

    const getTotalSpent = () => {
        return userBookings
            .filter(b => b.status === 'COMPLETED')
            .reduce((sum, b) => sum + parseFloat(b.totalPrice || 0), 0)
            .toFixed(2);
    };

    const profileItems = [
        {
            icon: 'person',
            label: 'Name',
            value: user?.name || 'N/A'
        },
        {
            icon: 'email',
            label: 'Email',
            value: user?.email || 'N/A'
        },
        {
            icon: 'phone',
            label: 'Phone',
            value: user?.phone || 'N/A'
        },
        {
            icon: 'badge',
            label: 'Role',
            value: user?.role || 'N/A'
        }
    ];

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            {/* Profile Header */}
            <View style={styles.header}>
                <View style={styles.avatarContainer}>
                    <Icon name="account-circle" size={80} color={COLORS.primary} />
                </View>
                <Text style={styles.name}>{user?.name || 'User'}</Text>
                <Text style={styles.email}>{user?.email || ''}</Text>
            </View>

            {/* Statistics */}
            <View style={styles.statsSection}>
                <Text style={styles.sectionTitle}>Statistics</Text>
                <View style={styles.statsContainer}>
                    <View style={styles.statBox}>
                        <Icon name="list" size={32} color={COLORS.primary} />
                        <Text style={styles.statNumber}>{userBookings.length}</Text>
                        <Text style={styles.statLabel}>Total Bookings</Text>
                    </View>
                    <View style={styles.statBox}>
                        <Icon name="payments" size={32} color={COLORS.success} />
                        <Text style={styles.statNumber}>₹{getTotalSpent()}</Text>
                        <Text style={styles.statLabel}>Total Spent</Text>
                    </View>
                </View>
            </View>

            {/* Profile Information */}
            <View style={styles.infoSection}>
                <Text style={styles.sectionTitle}>Profile Information</Text>
                <View style={styles.infoCard}>
                    {profileItems.map((item, index) => (
                        <View
                            key={index}
                            style={[
                                styles.infoItem,
                                index !== profileItems.length - 1 && styles.infoItemBorder
                            ]}
                        >
                            <View style={styles.infoLeft}>
                                <Icon name={item.icon} size={20} color={COLORS.textLight} />
                                <Text style={styles.infoLabel}>{item.label}</Text>
                            </View>
                            <Text style={styles.infoValue}>{item.value}</Text>
                        </View>
                    ))}
                </View>
            </View>

            {/* Settings Options */}
            <View style={styles.settingsSection}>
                <Text style={styles.sectionTitle}>Settings</Text>
                <View style={styles.settingsCard}>
                    <TouchableOpacity
                        style={styles.settingsItem}
                        onPress={() => Alert.alert('Coming Soon', 'Edit profile feature coming soon')}
                    >
                        <View style={styles.settingsLeft}>
                            <Icon name="edit" size={20} color={COLORS.text} />
                            <Text style={styles.settingsLabel}>Edit Profile</Text>
                        </View>
                        <Icon name="chevron-right" size={24} color={COLORS.gray} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.settingsItem, styles.settingsItemBorder]}
                        onPress={() => Alert.alert('Coming Soon', 'Change password feature coming soon')}
                    >
                        <View style={styles.settingsLeft}>
                            <Icon name="lock" size={20} color={COLORS.text} />
                            <Text style={styles.settingsLabel}>Change Password</Text>
                        </View>
                        <Icon name="chevron-right" size={24} color={COLORS.gray} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.settingsItem, styles.settingsItemBorder]}
                        onPress={() => Alert.alert('Coming Soon', 'Notifications settings coming soon')}
                    >
                        <View style={styles.settingsLeft}>
                            <Icon name="notifications" size={20} color={COLORS.text} />
                            <Text style={styles.settingsLabel}>Notifications</Text>
                        </View>
                        <Icon name="chevron-right" size={24} color={COLORS.gray} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.settingsItem}
                        onPress={() => Alert.alert('Coming Soon', 'Help & Support coming soon')}
                    >
                        <View style={styles.settingsLeft}>
                            <Icon name="help" size={20} color={COLORS.text} />
                            <Text style={styles.settingsLabel}>Help & Support</Text>
                        </View>
                        <Icon name="chevron-right" size={24} color={COLORS.gray} />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Logout Button */}
            <CustomButton
                title="Logout"
                onPress={handleLogout}
                variant="danger"
                style={styles.logoutButton}
            />

            <Text style={styles.version}>Version 1.0.0</Text>
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
    header: {
        alignItems: 'center',
        paddingVertical: 24,
        backgroundColor: COLORS.white,
        borderRadius: 12,
        marginBottom: 16
    },
    avatarContainer: {
        marginBottom: 12
    },
    name: {
        fontSize: 24,
        fontWeight: '700',
        color: COLORS.text,
        marginBottom: 4
    },
    email: {
        fontSize: 14,
        color: COLORS.textLight
    },
    statsSection: {
        marginBottom: 16
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: COLORS.text,
        marginBottom: 12
    },
    statsContainer: {
        flexDirection: 'row',
        gap: 12
    },
    statBox: {
        flex: 1,
        backgroundColor: COLORS.white,
        borderRadius: 12,
        padding: 20,
        alignItems: 'center'
    },
    statNumber: {
        fontSize: 20,
        fontWeight: '700',
        color: COLORS.text,
        marginTop: 8
    },
    statLabel: {
        fontSize: 12,
        color: COLORS.textLight,
        marginTop: 4,
        textAlign: 'center'
    },
    infoSection: {
        marginBottom: 16
    },
    infoCard: {
        backgroundColor: COLORS.white,
        borderRadius: 12,
        padding: 16
    },
    infoItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12
    },
    infoItemBorder: {
        borderBottomWidth: 1,
        borderBottomColor: COLORS.light
    },
    infoLeft: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    infoLabel: {
        fontSize: 14,
        color: COLORS.textLight,
        marginLeft: 12
    },
    infoValue: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.text
    },
    settingsSection: {
        marginBottom: 24
    },
    settingsCard: {
        backgroundColor: COLORS.white,
        borderRadius: 12,
        padding: 4
    },
    settingsItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 12
    },
    settingsItemBorder: {
        borderBottomWidth: 1,
        borderBottomColor: COLORS.light
    },
    settingsLeft: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    settingsLabel: {
        fontSize: 16,
        color: COLORS.text,
        marginLeft: 12
    },
    logoutButton: {
        marginBottom: 16
    },
    version: {
        fontSize: 12,
        color: COLORS.textLight,
        textAlign: 'center'
    }
});

export default ProfileScreen;

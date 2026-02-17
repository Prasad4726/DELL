import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    RefreshControl,
    TouchableOpacity,
    Alert
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { BookingCard, LoadingSpinner, ErrorMessage } from '../components';
import { fetchUserBookings } from '../store/slices/bookingSlice';
import { COLORS, BOOKING_STATUS } from '../utils/constants';

/**
 * HomeScreen
 * Main dashboard with quick stats and recent bookings
 */
const HomeScreen = ({ navigation }) => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { userBookings, loading, error } = useSelector((state) => state.booking);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        loadBookings();
    }, []);

    const loadBookings = async () => {
        try {
            await dispatch(fetchUserBookings()).unwrap();
        } catch (err) {
            console.error('Failed to load bookings:', err);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await loadBookings();
        setRefreshing(false);
    };

    const getBookingStats = () => {
        const active = userBookings.filter(
            b => b.status === BOOKING_STATUS.ACTIVE || b.status === BOOKING_STATUS.CONFIRMED
        ).length;
        const upcoming = userBookings.filter(
            b => b.status === BOOKING_STATUS.CONFIRMED && new Date(b.startTime) > new Date()
        ).length;
        const completed = userBookings.filter(
            b => b.status === BOOKING_STATUS.COMPLETED
        ).length;

        return { active, upcoming, completed };
    };

    const stats = getBookingStats();
    const recentBookings = userBookings.slice(0, 5);

    if (loading && !refreshing) {
        return <LoadingSpinner message="Loading dashboard..." />;
    }

    if (error && !refreshing) {
        return <ErrorMessage message={error} onRetry={loadBookings} />;
    }

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.content}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
        >
            {/* Welcome Section */}
            <View style={styles.welcomeSection}>
                <Text style={styles.welcomeText}>Welcome back,</Text>
                <Text style={styles.userName}>{user?.name || 'User'}</Text>
            </View>

            {/* Quick Stats */}
            <View style={styles.statsContainer}>
                <View style={[styles.statCard, { backgroundColor: COLORS.primary + '15' }]}>
                    <Icon name="local-parking" size={32} color={COLORS.primary} />
                    <Text style={styles.statNumber}>{stats.active}</Text>
                    <Text style={styles.statLabel}>Active</Text>
                </View>
                <View style={[styles.statCard, { backgroundColor: COLORS.success + '15' }]}>
                    <Icon name="schedule" size={32} color={COLORS.success} />
                    <Text style={styles.statNumber}>{stats.upcoming}</Text>
                    <Text style={styles.statLabel}>Upcoming</Text>
                </View>
                <View style={[styles.statCard, { backgroundColor: COLORS.gray + '15' }]}>
                    <Icon name="done-all" size={32} color={COLORS.gray} />
                    <Text style={styles.statNumber}>{stats.completed}</Text>
                    <Text style={styles.statLabel}>Completed</Text>
                </View>
            </View>

            {/* Quick Actions */}
            <View style={styles.actionsContainer}>
                <Text style={styles.sectionTitle}>Quick Actions</Text>
                <View style={styles.actionButtons}>
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => navigation.navigate('Map')}
                    >
                        <Icon name="search" size={28} color={COLORS.white} />
                        <Text style={styles.actionButtonText}>Find Parking</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => navigation.navigate('Bookings')}
                    >
                        <Icon name="list" size={28} color={COLORS.white} />
                        <Text style={styles.actionButtonText}>My Bookings</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Recent Bookings */}
            <View style={styles.recentSection}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Recent Bookings</Text>
                    {userBookings.length > 5 && (
                        <TouchableOpacity onPress={() => navigation.navigate('Bookings')}>
                            <Text style={styles.viewAllText}>View All</Text>
                        </TouchableOpacity>
                    )}
                </View>
                {recentBookings.length > 0 ? (
                    recentBookings.map((booking) => (
                        <BookingCard
                            key={booking.id}
                            booking={booking}
                            onPress={() => navigation.navigate('BookingDetails', { bookingId: booking.id })}
                        />
                    ))
                ) : (
                    <View style={styles.emptyState}>
                        <Icon name="inbox" size={64} color={COLORS.lightGray} />
                        <Text style={styles.emptyText}>No bookings yet</Text>
                        <Text style={styles.emptySubtext}>
                            Find a parking spot to get started
                        </Text>
                    </View>
                )}
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
        padding: 16
    },
    welcomeSection: {
        marginBottom: 24
    },
    welcomeText: {
        fontSize: 16,
        color: COLORS.textLight
    },
    userName: {
        fontSize: 28,
        fontWeight: '700',
        color: COLORS.text,
        marginTop: 4
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 24
    },
    statCard: {
        flex: 1,
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
        marginHorizontal: 4
    },
    statNumber: {
        fontSize: 24,
        fontWeight: '700',
        color: COLORS.text,
        marginTop: 8
    },
    statLabel: {
        fontSize: 12,
        color: COLORS.textLight,
        marginTop: 4
    },
    actionsContainer: {
        marginBottom: 24
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: COLORS.text,
        marginBottom: 12
    },
    actionButtons: {
        flexDirection: 'row',
        gap: 12
    },
    actionButton: {
        flex: 1,
        backgroundColor: COLORS.primary,
        borderRadius: 12,
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center'
    },
    actionButtonText: {
        color: COLORS.white,
        fontSize: 14,
        fontWeight: '600',
        marginTop: 8
    },
    recentSection: {
        marginBottom: 24
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12
    },
    viewAllText: {
        fontSize: 14,
        color: COLORS.primary,
        fontWeight: '600'
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: 48
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '600',
        color: COLORS.text,
        marginTop: 16
    },
    emptySubtext: {
        fontSize: 14,
        color: COLORS.textLight,
        marginTop: 8
    }
});

export default HomeScreen;

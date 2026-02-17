import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    RefreshControl,
    Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { getOwnerParkings, deleteParking } from '../services/parkingService';
import { COLORS, SPACING } from '../utils/constants';
import CustomButton from '../components/CustomButton';
import LoadingSpinner from '../components/LoadingSpinner';

/**
 * Owner Dashboard Screen
 * Manage parking locations and slots
 */
const OwnerDashboardScreen = () => {
    const navigation = useNavigation();
    const { user } = useSelector((state) => state.auth);

    const [parkings, setParkings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        fetchParkings();
    }, []);

    const fetchParkings = async () => {
        try {
            setLoading(true);
            const response = await getOwnerParkings();
            if (response.success) {
                setParkings(response.data);
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to load parkings');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const handleRefresh = () => {
        setRefreshing(true);
        fetchParkings();
    };

    const handleDeleteParking = (parkingId, parkingName) => {
        Alert.alert(
            'Delete Parking',
            `Are you sure you want to delete "${parkingName}"?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            const response = await deleteParking(parkingId);
                            if (response.success) {
                                Alert.alert('Success', 'Parking deleted successfully');
                                fetchParkings();
                            }
                        } catch (error) {
                            Alert.alert('Error', 'Failed to delete parking');
                        }
                    }
                }
            ]
        );
    };

    const renderParkingCard = (parking) => (
        <View key={parking.id} style={styles.parkingCard}>
            <View style={styles.parkingHeader}>
                <View style={styles.parkingInfo}>
                    <Text style={styles.parkingName}>{parking.name}</Text>
                    <Text style={styles.parkingAddress}>{parking.address}</Text>
                    <View style={styles.parkingMeta}>
                        <View style={styles.metaItem}>
                            <Icon name="local-parking" size={16} color={COLORS.gray} />
                            <Text style={styles.metaText}>
                                {parking.total_slots} slots
                            </Text>
                        </View>
                        <View style={styles.metaItem}>
                            <Icon name="attach-money" size={16} color={COLORS.gray} />
                            <Text style={styles.metaText}>
                                ₹{parking.price_per_hour}/hr
                            </Text>
                        </View>
                    </View>
                </View>
                <View style={styles.parkingBadge}>
                    <Text style={styles.badgeText}>{parking.type}</Text>
                </View>
            </View>

            <View style={styles.parkingActions}>
                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => navigation.navigate('EditParking', { parkingId: parking.id })}
                >
                    <Icon name="edit" size={20} color={COLORS.primary} />
                    <Text style={styles.actionText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => navigation.navigate('ManageSlots', { parkingId: parking.id })}
                >
                    <Icon name="view-list" size={20} color={COLORS.primary} />
                    <Text style={styles.actionText}>Slots</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.actionButton, styles.deleteButton]}
                    onPress={() => handleDeleteParking(parking.id, parking.name)}
                >
                    <Icon name="delete" size={20} color={COLORS.error} />
                    <Text style={[styles.actionText, styles.deleteText]}>Delete</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <View style={styles.container}>
            <ScrollView
                style={styles.scrollView}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
                }
            >
                {/* Stats Section */}
                <View style={styles.statsContainer}>
                    <View style={styles.statCard}>
                        <Icon name="local-parking" size={32} color={COLORS.primary} />
                        <Text style={styles.statValue}>{parkings.length}</Text>
                        <Text style={styles.statLabel}>Total Parkings</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Icon name="event-available" size={32} color={COLORS.success} />
                        <Text style={styles.statValue}>
                            {parkings.reduce((sum, p) => sum + (p.total_slots || 0), 0)}
                        </Text>
                        <Text style={styles.statLabel}>Total Slots</Text>
                    </View>
                </View>

                {/* Parkings List */}
                <View style={styles.listContainer}>
                    <Text style={styles.sectionTitle}>My Parkings</Text>
                    {parkings.length === 0 ? (
                        <View style={styles.emptyState}>
                            <Icon name="local-parking" size={64} color={COLORS.gray} />
                            <Text style={styles.emptyText}>No parkings yet</Text>
                            <Text style={styles.emptySubtext}>
                                Add your first parking location
                            </Text>
                        </View>
                    ) : (
                        parkings.map(renderParkingCard)
                    )}
                </View>
            </ScrollView>

            {/* Add Parking Button */}
            <View style={styles.fabContainer}>
                <TouchableOpacity
                    style={styles.fab}
                    onPress={() => navigation.navigate('AddParking')}
                >
                    <Icon name="add" size={28} color={COLORS.white} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background
    },
    scrollView: {
        flex: 1
    },
    statsContainer: {
        flexDirection: 'row',
        padding: SPACING.md,
        gap: SPACING.md
    },
    statCard: {
        flex: 1,
        backgroundColor: COLORS.white,
        padding: SPACING.md,
        borderRadius: 12,
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4
    },
    statValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.text,
        marginTop: SPACING.xs
    },
    statLabel: {
        fontSize: 12,
        color: COLORS.gray,
        marginTop: SPACING.xs
    },
    listContainer: {
        padding: SPACING.md
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: COLORS.text,
        marginBottom: SPACING.md
    },
    parkingCard: {
        backgroundColor: COLORS.white,
        borderRadius: 12,
        padding: SPACING.md,
        marginBottom: SPACING.md,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4
    },
    parkingHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: SPACING.md
    },
    parkingInfo: {
        flex: 1
    },
    parkingName: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.text,
        marginBottom: SPACING.xs
    },
    parkingAddress: {
        fontSize: 14,
        color: COLORS.gray,
        marginBottom: SPACING.sm
    },
    parkingMeta: {
        flexDirection: 'row',
        gap: SPACING.md
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4
    },
    metaText: {
        fontSize: 12,
        color: COLORS.gray
    },
    parkingBadge: {
        backgroundColor: COLORS.primaryLight,
        paddingHorizontal: SPACING.sm,
        paddingVertical: 4,
        borderRadius: 4,
        height: 24
    },
    badgeText: {
        fontSize: 12,
        color: COLORS.primary,
        fontWeight: '600'
    },
    parkingActions: {
        flexDirection: 'row',
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
        paddingTop: SPACING.md,
        gap: SPACING.sm
    },
    actionButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4
    },
    actionText: {
        fontSize: 14,
        color: COLORS.primary,
        fontWeight: '500'
    },
    deleteButton: {},
    deleteText: {
        color: COLORS.error
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: SPACING.xl * 2
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '600',
        color: COLORS.text,
        marginTop: SPACING.md
    },
    emptySubtext: {
        fontSize: 14,
        color: COLORS.gray,
        marginTop: SPACING.xs
    },
    fabContainer: {
        position: 'absolute',
        bottom: SPACING.lg,
        right: SPACING.lg
    },
    fab: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: COLORS.primary,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4
    }
});

export default OwnerDashboardScreen;

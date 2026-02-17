import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Alert,
    RefreshControl
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useRoute } from '@react-navigation/native';
import { getParkingSlots, updateSlotStatus } from '../services/parkingService';
import { COLORS, SPACING, SLOT_STATUS } from '../utils/constants';
import LoadingSpinner from '../components/LoadingSpinner';

/**
 * Manage Slots Screen
 * View and manage parking slots for a specific parking
 */
const ManageSlotsScreen = () => {
    const route = useRoute();
    const { parkingId } = route.params;

    const [slots, setSlots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        fetchSlots();
    }, []);

    const fetchSlots = async () => {
        try {
            setLoading(true);
            const response = await getParkingSlots(parkingId);
            if (response.success) {
                setSlots(response.data);
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to load slots');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const handleRefresh = () => {
        setRefreshing(true);
        fetchSlots();
    };

    const handleToggleSlotStatus = (slotId, currentStatus) => {
        const newStatus = currentStatus === 'AVAILABLE' ? 'MAINTENANCE' : 'AVAILABLE';
        const statusText = newStatus === 'AVAILABLE' ? 'available' : 'maintenance';

        Alert.alert(
            'Update Slot Status',
            `Mark this slot as ${statusText}?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Confirm',
                    onPress: async () => {
                        try {
                            const response = await updateSlotStatus(slotId, newStatus);
                            if (response.success) {
                                fetchSlots();
                            }
                        } catch (error) {
                            Alert.alert('Error', 'Failed to update slot status');
                        }
                    }
                }
            ]
        );
    };

    const getSlotStatusColor = (status) => {
        switch (status) {
            case 'AVAILABLE':
                return COLORS.success;
            case 'OCCUPIED':
                return COLORS.error;
            case 'MAINTENANCE':
                return COLORS.warning;
            default:
                return COLORS.gray;
        }
    };

    const getSlotStatusIcon = (status) => {
        switch (status) {
            case 'AVAILABLE':
                return 'check-circle';
            case 'OCCUPIED':
                return 'cancel';
            case 'MAINTENANCE':
                return 'build';
            default:
                return 'help';
        }
    };

    const renderSlotItem = ({ item }) => (
        <View style={styles.slotCard}>
            <View style={styles.slotHeader}>
                <View style={styles.slotInfo}>
                    <Text style={styles.slotNumber}>Slot {item.slot_number}</Text>
                    <View
                        style={[
                            styles.statusBadge,
                            { backgroundColor: getSlotStatusColor(item.status) + '20' }
                        ]}
                    >
                        <Icon
                            name={getSlotStatusIcon(item.status)}
                            size={14}
                            color={getSlotStatusColor(item.status)}
                        />
                        <Text
                            style={[
                                styles.statusText,
                                { color: getSlotStatusColor(item.status) }
                            ]}
                        >
                            {item.status}
                        </Text>
                    </View>
                </View>

                {item.status !== 'OCCUPIED' && (
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => handleToggleSlotStatus(item.id, item.status)}
                    >
                        <Icon
                            name={item.status === 'AVAILABLE' ? 'build' : 'check'}
                            size={20}
                            color={COLORS.primary}
                        />
                    </TouchableOpacity>
                )}
            </View>

            {item.current_booking && (
                <View style={styles.bookingInfo}>
                    <Icon name="event" size={16} color={COLORS.gray} />
                    <Text style={styles.bookingText}>
                        Booked until {new Date(item.current_booking.end_time).toLocaleString()}
                    </Text>
                </View>
            )}
        </View>
    );

    if (loading) {
        return <LoadingSpinner />;
    }

    const availableSlots = slots.filter((s) => s.status === 'AVAILABLE').length;
    const occupiedSlots = slots.filter((s) => s.status === 'OCCUPIED').length;
    const maintenanceSlots = slots.filter((s) => s.status === 'MAINTENANCE').length;

    return (
        <View style={styles.container}>
            {/* Stats Header */}
            <View style={styles.statsHeader}>
                <View style={styles.statItem}>
                    <Text style={styles.statValue}>{availableSlots}</Text>
                    <Text style={styles.statLabel}>Available</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                    <Text style={[styles.statValue, { color: COLORS.error }]}>
                        {occupiedSlots}
                    </Text>
                    <Text style={styles.statLabel}>Occupied</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                    <Text style={[styles.statValue, { color: COLORS.warning }]}>
                        {maintenanceSlots}
                    </Text>
                    <Text style={styles.statLabel}>Maintenance</Text>
                </View>
            </View>

            {/* Slots List */}
            <FlatList
                data={slots}
                renderItem={renderSlotItem}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.listContent}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
                }
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <Icon name="local-parking" size={64} color={COLORS.gray} />
                        <Text style={styles.emptyText}>No slots found</Text>
                    </View>
                }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background
    },
    statsHeader: {
        flexDirection: 'row',
        backgroundColor: COLORS.white,
        padding: SPACING.md,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4
    },
    statItem: {
        flex: 1,
        alignItems: 'center'
    },
    statValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.success
    },
    statLabel: {
        fontSize: 12,
        color: COLORS.gray,
        marginTop: 4
    },
    statDivider: {
        width: 1,
        backgroundColor: COLORS.border
    },
    listContent: {
        padding: SPACING.md
    },
    slotCard: {
        backgroundColor: COLORS.white,
        borderRadius: 8,
        padding: SPACING.md,
        marginBottom: SPACING.sm,
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2
    },
    slotHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    slotInfo: {
        flex: 1
    },
    slotNumber: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.text,
        marginBottom: SPACING.xs
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        paddingHorizontal: SPACING.sm,
        paddingVertical: 4,
        borderRadius: 4,
        gap: 4
    },
    statusText: {
        fontSize: 12,
        fontWeight: '600'
    },
    actionButton: {
        padding: SPACING.sm
    },
    bookingInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: SPACING.sm,
        paddingTop: SPACING.sm,
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
        gap: SPACING.xs
    },
    bookingText: {
        fontSize: 12,
        color: COLORS.gray
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: SPACING.xl * 2
    },
    emptyText: {
        fontSize: 16,
        color: COLORS.gray,
        marginTop: SPACING.md
    }
});

export default ManageSlotsScreen;

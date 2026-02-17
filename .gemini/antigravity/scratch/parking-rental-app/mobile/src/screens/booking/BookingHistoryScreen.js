import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    RefreshControl
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyBookings } from '../../store/slices/bookingSlice';
import { COLORS, SIZES } from '../../utils/constants';
import { formatDate, formatCurrency, getBookingStatusColor } from '../../utils/helpers';

/**
 * Booking History Screen
 */
const BookingHistoryScreen = ({ navigation }) => {
    const dispatch = useDispatch();
    const { myBookings, loading } = useSelector((state) => state.booking);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        loadBookings();
    }, []);

    const loadBookings = () => {
        dispatch(fetchMyBookings());
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await loadBookings();
        setRefreshing(false);
    };

    const renderBookingItem = ({ item }) => (
        <TouchableOpacity
            style={styles.bookingCard}
            onPress={() => navigation.navigate('BookingDetails', { bookingId: item.id })}
        >
            <View style={styles.bookingHeader}>
                <Text style={styles.parkingName}>{item.parking?.name}</Text>
                <View style={[styles.statusBadge, { backgroundColor: getBookingStatusColor(item.status) }]}>
                    <Text style={styles.statusText}>{item.status}</Text>
                </View>
            </View>

            <Text style={styles.address}>{item.parking?.address}</Text>
            <Text style={styles.slotNumber}>Slot: {item.slot?.slotNumber}</Text>

            <View style={styles.bookingDetails}>
                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Start:</Text>
                    <Text style={styles.detailValue}>{formatDate(item.startTime)}</Text>
                </View>
                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>End:</Text>
                    <Text style={styles.detailValue}>{formatDate(item.endTime)}</Text>
                </View>
                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Total:</Text>
                    <Text style={[styles.detailValue, styles.priceText]}>
                        {formatCurrency(item.totalPrice)}
                    </Text>
                </View>
            </View>

            <Text style={styles.bookingCode}>Code: {item.bookingCode}</Text>
        </TouchableOpacity>
    );

    if (loading && !refreshing) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={myBookings}
                renderItem={renderBookingItem}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.listContainer}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>No bookings yet</Text>
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
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    listContainer: {
        padding: SIZES.padding
    },
    bookingCard: {
        backgroundColor: COLORS.white,
        borderRadius: SIZES.radius,
        padding: SIZES.padding,
        marginBottom: SIZES.margin,
        elevation: 2,
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4
    },
    bookingHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SIZES.margin / 2
    },
    parkingName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.dark,
        flex: 1
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12
    },
    statusText: {
        color: COLORS.white,
        fontSize: 12,
        fontWeight: 'bold'
    },
    address: {
        fontSize: 14,
        color: COLORS.textLight,
        marginBottom: SIZES.margin / 4
    },
    slotNumber: {
        fontSize: 14,
        color: COLORS.text,
        marginBottom: SIZES.margin
    },
    bookingDetails: {
        borderTopWidth: 1,
        borderTopColor: COLORS.lightGray,
        paddingTop: SIZES.padding / 2,
        marginBottom: SIZES.margin / 2
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: SIZES.margin / 4
    },
    detailLabel: {
        fontSize: 14,
        color: COLORS.textLight
    },
    detailValue: {
        fontSize: 14,
        color: COLORS.text,
        fontWeight: '500'
    },
    priceText: {
        color: COLORS.primary,
        fontWeight: 'bold',
        fontSize: 16
    },
    bookingCode: {
        fontSize: 12,
        color: COLORS.gray,
        fontStyle: 'italic'
    },
    emptyContainer: {
        padding: SIZES.padding * 3,
        alignItems: 'center'
    },
    emptyText: {
        fontSize: 16,
        color: COLORS.textLight
    }
});

export default BookingHistoryScreen;

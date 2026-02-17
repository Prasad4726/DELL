import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Alert,
    Dimensions
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useDispatch } from 'react-redux';
import { fetchParkingById } from '../store/slices/parkingSlice';
import parkingService from '../services/parkingService';
import reviewService from '../services/reviewService';
import { LoadingSpinner, ErrorMessage, CustomButton } from '../components';
import { COLORS, PARKING_TYPES } from '../utils/constants';

const { width } = Dimensions.get('window');

/**
 * ParkingDetailsScreen
 * Display detailed parking information
 */
const ParkingDetailsScreen = ({ route, navigation }) => {
    const { parkingId } = route.params;
    const [parking, setParking] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadParkingDetails();
    }, [parkingId]);

    const loadParkingDetails = async () => {
        try {
            setLoading(true);
            setError(null);

            const [parkingResponse, reviewsResponse] = await Promise.all([
                parkingService.getParkingById(parkingId),
                reviewService.getParkingReviews(parkingId).catch(() => ({ data: { reviews: [] } }))
            ]);

            setParking(parkingResponse.data);
            setReviews(reviewsResponse.data.reviews || []);
        } catch (err) {
            setError(err.message || 'Failed to load parking details');
        } finally {
            setLoading(false);
        }
    };

    const handleBookNow = () => {
        navigation.navigate('CreateBooking', { parking });
    };

    const getAverageRating = () => {
        if (reviews.length === 0) return 0;
        const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
        return (sum / reviews.length).toFixed(1);
    };

    if (loading) {
        return <LoadingSpinner message="Loading parking details..." />;
    }

    if (error) {
        return <ErrorMessage message={error} onRetry={loadParkingDetails} />;
    }

    if (!parking) {
        return <ErrorMessage message="Parking not found" />;
    }

    const availableSlots = parking.totalSlots - (parking.occupiedSlots || 0);
    const averageRating = getAverageRating();

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                {/* Map Preview */}
                <View style={styles.mapContainer}>
                    <MapView
                        provider={PROVIDER_GOOGLE}
                        style={styles.map}
                        initialRegion={{
                            latitude: parseFloat(parking.latitude),
                            longitude: parseFloat(parking.longitude),
                            latitudeDelta: 0.01,
                            longitudeDelta: 0.01
                        }}
                        scrollEnabled={false}
                        zoomEnabled={false}
                    >
                        <Marker
                            coordinate={{
                                latitude: parseFloat(parking.latitude),
                                longitude: parseFloat(parking.longitude)
                            }}
                        />
                    </MapView>
                </View>

                {/* Parking Info */}
                <View style={styles.infoCard}>
                    <View style={styles.header}>
                        <View style={styles.titleContainer}>
                            <Text style={styles.name}>{parking.name}</Text>
                            <View style={[
                                styles.typeBadge,
                                parking.type === PARKING_TYPES.PUBLIC
                                    ? styles.publicBadge
                                    : styles.privateBadge
                            ]}>
                                <Text style={styles.typeText}>{parking.type}</Text>
                            </View>
                        </View>
                        <Text style={styles.price}>₹{parking.pricePerHour}/hr</Text>
                    </View>

                    <View style={styles.addressContainer}>
                        <Icon name="location-on" size={20} color={COLORS.textLight} />
                        <Text style={styles.address}>{parking.address}</Text>
                    </View>

                    {/* Stats */}
                    <View style={styles.statsContainer}>
                        <View style={styles.statItem}>
                            <Icon name="local-parking" size={24} color={COLORS.primary} />
                            <Text style={styles.statValue}>{availableSlots}</Text>
                            <Text style={styles.statLabel}>Available</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Icon name="garage" size={24} color={COLORS.gray} />
                            <Text style={styles.statValue}>{parking.totalSlots}</Text>
                            <Text style={styles.statLabel}>Total Slots</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Icon name="star" size={24} color={COLORS.warning} />
                            <Text style={styles.statValue}>{averageRating}</Text>
                            <Text style={styles.statLabel}>Rating</Text>
                        </View>
                    </View>
                </View>

                {/* Reviews */}
                {reviews.length > 0 && (
                    <View style={styles.reviewsCard}>
                        <Text style={styles.sectionTitle}>
                            Reviews ({reviews.length})
                        </Text>
                        {reviews.slice(0, 3).map((review, index) => (
                            <View key={index} style={styles.reviewItem}>
                                <View style={styles.reviewHeader}>
                                    <Text style={styles.reviewerName}>
                                        {review.user?.name || 'Anonymous'}
                                    </Text>
                                    <View style={styles.ratingContainer}>
                                        <Icon name="star" size={16} color={COLORS.warning} />
                                        <Text style={styles.ratingText}>{review.rating}</Text>
                                    </View>
                                </View>
                                {review.comment && (
                                    <Text style={styles.reviewComment}>{review.comment}</Text>
                                )}
                            </View>
                        ))}
                        {reviews.length > 3 && (
                            <Text style={styles.moreReviews}>
                                +{reviews.length - 3} more reviews
                            </Text>
                        )}
                    </View>
                )}
            </ScrollView>

            {/* Book Now Button */}
            <View style={styles.footer}>
                <View style={styles.priceInfo}>
                    <Text style={styles.priceLabel}>Price per hour</Text>
                    <Text style={styles.priceValue}>₹{parking.pricePerHour}</Text>
                </View>
                <CustomButton
                    title="Book Now"
                    onPress={handleBookNow}
                    disabled={availableSlots === 0}
                    style={styles.bookButton}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background
    },
    content: {
        paddingBottom: 100
    },
    mapContainer: {
        height: 200,
        width: '100%'
    },
    map: {
        flex: 1
    },
    infoCard: {
        backgroundColor: COLORS.white,
        padding: 16,
        marginBottom: 12
    },
    header: {
        marginBottom: 12
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8
    },
    name: {
        fontSize: 24,
        fontWeight: '700',
        color: COLORS.text,
        flex: 1
    },
    typeBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
        marginLeft: 8
    },
    publicBadge: {
        backgroundColor: COLORS.primary + '20'
    },
    privateBadge: {
        backgroundColor: COLORS.secondary + '20'
    },
    typeText: {
        fontSize: 12,
        fontWeight: '600',
        color: COLORS.text
    },
    price: {
        fontSize: 28,
        fontWeight: '700',
        color: COLORS.primary
    },
    addressContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 16
    },
    address: {
        fontSize: 14,
        color: COLORS.textLight,
        marginLeft: 8,
        flex: 1
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: COLORS.light
    },
    statItem: {
        alignItems: 'center'
    },
    statValue: {
        fontSize: 20,
        fontWeight: '700',
        color: COLORS.text,
        marginTop: 4
    },
    statLabel: {
        fontSize: 12,
        color: COLORS.textLight,
        marginTop: 4
    },
    reviewsCard: {
        backgroundColor: COLORS.white,
        padding: 16,
        marginBottom: 12
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: COLORS.text,
        marginBottom: 12
    },
    reviewItem: {
        marginBottom: 12,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.light
    },
    reviewHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4
    },
    reviewerName: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.text
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    ratingText: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.text,
        marginLeft: 4
    },
    reviewComment: {
        fontSize: 14,
        color: COLORS.textLight,
        lineHeight: 20
    },
    moreReviews: {
        fontSize: 14,
        color: COLORS.primary,
        fontWeight: '600',
        textAlign: 'center'
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: COLORS.white,
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: COLORS.light,
        elevation: 8,
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4
    },
    priceInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12
    },
    priceLabel: {
        fontSize: 14,
        color: COLORS.textLight
    },
    priceValue: {
        fontSize: 24,
        fontWeight: '700',
        color: COLORS.primary
    },
    bookButton: {
        width: '100%'
    }
});

export default ParkingDetailsScreen;

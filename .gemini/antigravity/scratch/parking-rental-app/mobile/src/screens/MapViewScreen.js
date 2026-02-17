import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Alert,
    TouchableOpacity,
    PermissionsAndroid,
    Platform
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { fetchNearbyParkings } from '../store/slices/parkingSlice';
import { LoadingSpinner } from '../components';
import { COLORS, MAP_CONFIG, PARKING_TYPES } from '../utils/constants';

/**
 * MapViewScreen
 * Interactive map showing nearby parking locations
 */
const MapViewScreen = ({ navigation }) => {
    const dispatch = useDispatch();
    const { nearbyParkings, loading, searchLocation } = useSelector((state) => state.parking);

    const [currentLocation, setCurrentLocation] = useState(null);
    const [mapRef, setMapRef] = useState(null);
    const [radius, setRadius] = useState(MAP_CONFIG.SEARCH_RADIUS);
    const [parkingType, setParkingType] = useState(null);

    useEffect(() => {
        requestLocationPermission();
    }, []);

    const requestLocationPermission = async () => {
        if (Platform.OS === 'android') {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
                );
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    getCurrentLocation();
                } else {
                    Alert.alert('Permission Denied', 'Location permission is required to find nearby parking');
                }
            } catch (err) {
                console.error('Permission error:', err);
            }
        } else {
            getCurrentLocation();
        }
    };

    const getCurrentLocation = () => {
        Geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                const location = { latitude, longitude };
                setCurrentLocation(location);
                searchNearbyParkings(latitude, longitude);
            },
            (error) => {
                console.error('Location error:', error);
                Alert.alert('Error', 'Failed to get current location');
                // Use default location
                const defaultLocation = {
                    latitude: MAP_CONFIG.DEFAULT_LATITUDE,
                    longitude: MAP_CONFIG.DEFAULT_LONGITUDE
                };
                setCurrentLocation(defaultLocation);
                searchNearbyParkings(defaultLocation.latitude, defaultLocation.longitude);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
    };

    const searchNearbyParkings = async (latitude, longitude) => {
        try {
            await dispatch(fetchNearbyParkings(latitude, longitude, radius, parkingType)).unwrap();

            // Fit map to show all markers
            if (mapRef && nearbyParkings.length > 0) {
                const coordinates = nearbyParkings.map(p => ({
                    latitude: parseFloat(p.latitude),
                    longitude: parseFloat(p.longitude)
                }));
                coordinates.push({ latitude, longitude });

                mapRef.fitToCoordinates(coordinates, {
                    edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
                    animated: true
                });
            }
        } catch (err) {
            Alert.alert('Error', 'Failed to load nearby parkings');
        }
    };

    const handleMarkerPress = (parking) => {
        navigation.navigate('ParkingDetails', { parkingId: parking.id });
    };

    const handleRefresh = () => {
        if (currentLocation) {
            searchNearbyParkings(currentLocation.latitude, currentLocation.longitude);
        }
    };

    const handleRadiusChange = (newRadius) => {
        setRadius(newRadius);
        if (currentLocation) {
            searchNearbyParkings(currentLocation.latitude, currentLocation.longitude);
        }
    };

    const handleTypeFilter = (type) => {
        const newType = parkingType === type ? null : type;
        setParkingType(newType);
        if (currentLocation) {
            dispatch(fetchNearbyParkings(
                currentLocation.latitude,
                currentLocation.longitude,
                radius,
                newType
            ));
        }
    };

    if (!currentLocation) {
        return <LoadingSpinner message="Getting your location..." />;
    }

    return (
        <View style={styles.container}>
            <MapView
                ref={setMapRef}
                provider={PROVIDER_GOOGLE}
                style={styles.map}
                initialRegion={{
                    latitude: currentLocation.latitude,
                    longitude: currentLocation.longitude,
                    latitudeDelta: 0.05,
                    longitudeDelta: 0.05
                }}
                showsUserLocation
                showsMyLocationButton={false}
            >
                {nearbyParkings.map((parking) => (
                    <Marker
                        key={parking.id}
                        coordinate={{
                            latitude: parseFloat(parking.latitude),
                            longitude: parseFloat(parking.longitude)
                        }}
                        onPress={() => handleMarkerPress(parking)}
                    >
                        <View style={styles.markerContainer}>
                            <View style={[
                                styles.marker,
                                parking.type === PARKING_TYPES.PUBLIC
                                    ? styles.publicMarker
                                    : styles.privateMarker
                            ]}>
                                <Icon name="local-parking" size={20} color={COLORS.white} />
                            </View>
                            <View style={styles.markerArrow} />
                        </View>
                    </Marker>
                ))}
            </MapView>

            {/* Controls */}
            <View style={styles.controls}>
                {/* Radius Selector */}
                <View style={styles.radiusContainer}>
                    <Text style={styles.controlLabel}>Search Radius</Text>
                    <View style={styles.radiusButtons}>
                        {[1000, 3000, 5000].map((r) => (
                            <TouchableOpacity
                                key={r}
                                style={[
                                    styles.radiusButton,
                                    radius === r && styles.radiusButtonActive
                                ]}
                                onPress={() => handleRadiusChange(r)}
                            >
                                <Text
                                    style={[
                                        styles.radiusButtonText,
                                        radius === r && styles.radiusButtonTextActive
                                    ]}
                                >
                                    {r / 1000}km
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Type Filter */}
                <View style={styles.filterContainer}>
                    <Text style={styles.controlLabel}>Type</Text>
                    <View style={styles.filterButtons}>
                        <TouchableOpacity
                            style={[
                                styles.filterButton,
                                parkingType === PARKING_TYPES.PUBLIC && styles.filterButtonActive
                            ]}
                            onPress={() => handleTypeFilter(PARKING_TYPES.PUBLIC)}
                        >
                            <Text
                                style={[
                                    styles.filterButtonText,
                                    parkingType === PARKING_TYPES.PUBLIC && styles.filterButtonTextActive
                                ]}
                            >
                                Public
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                styles.filterButton,
                                parkingType === PARKING_TYPES.PRIVATE && styles.filterButtonActive
                            ]}
                            onPress={() => handleTypeFilter(PARKING_TYPES.PRIVATE)}
                        >
                            <Text
                                style={[
                                    styles.filterButtonText,
                                    parkingType === PARKING_TYPES.PRIVATE && styles.filterButtonTextActive
                                ]}
                            >
                                Private
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            {/* Refresh Button */}
            <TouchableOpacity
                style={styles.refreshButton}
                onPress={handleRefresh}
                disabled={loading}
            >
                <Icon name="refresh" size={24} color={COLORS.white} />
            </TouchableOpacity>

            {/* Results Count */}
            <View style={styles.resultsContainer}>
                <Text style={styles.resultsText}>
                    {nearbyParkings.length} parking{nearbyParkings.length !== 1 ? 's' : ''} found
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    map: {
        flex: 1
    },
    markerContainer: {
        alignItems: 'center'
    },
    marker: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 3,
        borderColor: COLORS.white
    },
    publicMarker: {
        backgroundColor: COLORS.primary
    },
    privateMarker: {
        backgroundColor: COLORS.secondary
    },
    markerArrow: {
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderLeftWidth: 6,
        borderRightWidth: 6,
        borderTopWidth: 8,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderTopColor: COLORS.white
    },
    controls: {
        position: 'absolute',
        top: 16,
        left: 16,
        right: 16,
        backgroundColor: COLORS.white,
        borderRadius: 12,
        padding: 16,
        elevation: 4,
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4
    },
    controlLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: COLORS.textLight,
        marginBottom: 8
    },
    radiusContainer: {
        marginBottom: 12
    },
    radiusButtons: {
        flexDirection: 'row',
        gap: 8
    },
    radiusButton: {
        flex: 1,
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: COLORS.lightGray,
        alignItems: 'center',
        backgroundColor: COLORS.white
    },
    radiusButtonActive: {
        borderColor: COLORS.primary,
        backgroundColor: COLORS.primary + '10'
    },
    radiusButtonText: {
        fontSize: 12,
        fontWeight: '600',
        color: COLORS.gray
    },
    radiusButtonTextActive: {
        color: COLORS.primary
    },
    filterContainer: {
        marginBottom: 0
    },
    filterButtons: {
        flexDirection: 'row',
        gap: 8
    },
    filterButton: {
        flex: 1,
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: COLORS.lightGray,
        alignItems: 'center',
        backgroundColor: COLORS.white
    },
    filterButtonActive: {
        borderColor: COLORS.primary,
        backgroundColor: COLORS.primary + '10'
    },
    filterButtonText: {
        fontSize: 12,
        fontWeight: '600',
        color: COLORS.gray
    },
    filterButtonTextActive: {
        color: COLORS.primary
    },
    refreshButton: {
        position: 'absolute',
        bottom: 80,
        right: 16,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: COLORS.primary,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 4,
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4
    },
    resultsContainer: {
        position: 'absolute',
        bottom: 16,
        left: 16,
        backgroundColor: COLORS.white,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        elevation: 2,
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2
    },
    resultsText: {
        fontSize: 12,
        fontWeight: '600',
        color: COLORS.text
    }
});

export default MapViewScreen;

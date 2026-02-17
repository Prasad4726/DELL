import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider, useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import store from './store';
import { loadUserFromStorage } from './store/slices/authSlice';
import { COLORS } from './utils/constants';

// Import screens
import LoginScreen from './screens/auth/LoginScreen';
import SignupScreen from './screens/auth/SignupScreen';
import HomeScreen from './screens/HomeScreen';
import MapViewScreen from './screens/MapViewScreen';
import ProfileScreen from './screens/ProfileScreen';
import BookingHistoryScreen from './screens/booking/BookingHistoryScreen';
import ParkingDetailsScreen from './screens/booking/ParkingDetailsScreen';
import CreateBookingScreen from './screens/booking/CreateBookingScreen';
import BookingDetailsScreen from './screens/booking/BookingDetailsScreen';
import PaymentScreen from './screens/PaymentScreen';
import OwnerDashboardScreen from './screens/owner/OwnerDashboardScreen';
import AddEditParkingScreen from './screens/owner/AddEditParkingScreen';
import ManageSlotsScreen from './screens/owner/ManageSlotsScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

/**
 * Auth Navigator
 */
const AuthNavigator = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
    </Stack.Navigator>
);

/**
 * Main Tab Navigator
 */
const MainNavigator = () => {
    const { user } = useSelector((state) => state.auth);
    const isOwner = user?.role === 'OWNER';

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === 'Home') {
                        iconName = 'home';
                    } else if (route.name === 'Map') {
                        iconName = 'map';
                    } else if (route.name === 'Bookings') {
                        iconName = 'list';
                    } else if (route.name === 'Dashboard') {
                        iconName = 'dashboard';
                    } else if (route.name === 'Profile') {
                        iconName = 'person';
                    }

                    return <Icon name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: COLORS.primary,
                tabBarInactiveTintColor: COLORS.gray,
                headerShown: true
            })}
        >
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{ title: 'Home' }}
            />
            <Tab.Screen
                name="Map"
                component={MapViewScreen}
                options={{ title: 'Find Parking' }}
            />
            <Tab.Screen
                name="Bookings"
                component={BookingHistoryScreen}
                options={{ title: 'My Bookings' }}
            />
            {isOwner && (
                <Tab.Screen
                    name="Dashboard"
                    component={OwnerDashboardScreen}
                    options={{ title: 'My Parkings' }}
                />
            )}
            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{ title: 'Profile' }}
            />
        </Tab.Navigator>
    );
};

/**
 * Root Stack Navigator (includes modals and detail screens)
 */
const RootNavigator = () => (
    <Stack.Navigator>
        <Stack.Screen
            name="Main"
            component={MainNavigator}
            options={{ headerShown: false }}
        />
        <Stack.Screen
            name="ParkingDetails"
            component={ParkingDetailsScreen}
            options={{ title: 'Parking Details' }}
        />
        <Stack.Screen
            name="CreateBooking"
            component={CreateBookingScreen}
            options={{ title: 'Create Booking' }}
        />
        <Stack.Screen
            name="BookingDetails"
            component={BookingDetailsScreen}
            options={{ title: 'Booking Details' }}
        />
        <Stack.Screen
            name="Payment"
            component={PaymentScreen}
            options={{ title: 'Payment' }}
        />
        <Stack.Screen
            name="AddParking"
            component={AddEditParkingScreen}
            options={{ title: 'Add Parking' }}
        />
        <Stack.Screen
            name="EditParking"
            component={AddEditParkingScreen}
            options={{ title: 'Edit Parking' }}
        />
        <Stack.Screen
            name="ManageSlots"
            component={ManageSlotsScreen}
            options={{ title: 'Manage Slots' }}
        />
    </Stack.Navigator>
);

/**
 * App Navigator
 */
const AppNavigator = () => {
    const dispatch = useDispatch();
    const { isAuthenticated } = useSelector((state) => state.auth);

    useEffect(() => {
        dispatch(loadUserFromStorage());
    }, []);

    return (
        <NavigationContainer>
            {isAuthenticated ? <RootNavigator /> : <AuthNavigator />}
        </NavigationContainer>
    );
};

/**
 * Main App Component
 */
const App = () => {
    return (
        <Provider store={store}>
            <AppNavigator />
        </Provider>
    );
};

export default App;

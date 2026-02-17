import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import parkingReducer from './slices/parkingSlice';
import bookingReducer from './slices/bookingSlice';

/**
 * Redux Store Configuration
 */

const store = configureStore({
    reducer: {
        auth: authReducer,
        parking: parkingReducer,
        booking: bookingReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                // Ignore these action types
                ignoredActions: ['auth/loginSuccess', 'auth/updateUser'],
                // Ignore these field paths in all actions
                ignoredActionPaths: ['payload.timestamp'],
                // Ignore these paths in the state
                ignoredPaths: ['auth.user.createdAt', 'auth.user.updatedAt']
            }
        })
});

export default store;

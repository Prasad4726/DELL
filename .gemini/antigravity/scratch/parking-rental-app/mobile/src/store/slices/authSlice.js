import { createSlice } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Authentication Slice
 * Manages authentication state
 */

const initialState = {
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false,
    error: null
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        loginSuccess: (state, action) => {
            state.loading = false;
            state.isAuthenticated = true;
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.error = null;
        },
        loginFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            state.loading = false;
            state.error = null;
        },
        updateUser: (state, action) => {
            state.user = { ...state.user, ...action.payload };
        },
        clearError: (state) => {
            state.error = null;
        }
    }
});

export const {
    loginStart,
    loginSuccess,
    loginFailure,
    logout,
    updateUser,
    clearError
} = authSlice.actions;

// Thunks
export const loginUser = (email, password) => async (dispatch) => {
    try {
        dispatch(loginStart());
        const authService = require('../../services/authService').default;
        const response = await authService.login(email, password);

        // Save to AsyncStorage
        await AsyncStorage.setItem('authToken', response.data.token);
        await AsyncStorage.setItem('user', JSON.stringify(response.data.user));

        dispatch(loginSuccess(response.data));
    } catch (error) {
        dispatch(loginFailure(error.message));
    }
};

export const registerUser = (userData) => async (dispatch) => {
    try {
        dispatch(loginStart());
        const authService = require('../../services/authService').default;
        const response = await authService.register(userData);

        // Save to AsyncStorage
        await AsyncStorage.setItem('authToken', response.data.token);
        await AsyncStorage.setItem('user', JSON.stringify(response.data.user));

        dispatch(loginSuccess(response.data));
    } catch (error) {
        dispatch(loginFailure(error.message));
    }
};

export const logoutUser = () => async (dispatch) => {
    await AsyncStorage.multiRemove(['authToken', 'user']);
    dispatch(logout());
};

export const loadUserFromStorage = () => async (dispatch) => {
    try {
        const token = await AsyncStorage.getItem('authToken');
        const userStr = await AsyncStorage.getItem('user');

        if (token && userStr) {
            const user = JSON.parse(userStr);
            dispatch(loginSuccess({ user, token }));
        }
    } catch (error) {
        console.error('Error loading user from storage:', error);
    }
};

export default authSlice.reducer;

import { createSlice } from '@reduxjs/toolkit';

/**
 * Booking Slice
 * Manages booking state
 */

const initialState = {
    myBookings: [],
    currentBooking: null,
    loading: false,
    error: null
};

const bookingSlice = createSlice({
    name: 'booking',
    initialState,
    reducers: {
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setMyBookings: (state, action) => {
            state.myBookings = action.payload;
            state.loading = false;
            state.error = null;
        },
        setCurrentBooking: (state, action) => {
            state.currentBooking = action.payload;
            state.loading = false;
        },
        addBooking: (state, action) => {
            state.myBookings.unshift(action.payload);
            state.currentBooking = action.payload;
        },
        updateBooking: (state, action) => {
            const index = state.myBookings.findIndex(b => b.id === action.payload.id);
            if (index !== -1) {
                state.myBookings[index] = action.payload;
            }
            if (state.currentBooking?.id === action.payload.id) {
                state.currentBooking = action.payload;
            }
        },
        setError: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
        clearError: (state) => {
            state.error = null;
        },
        clearCurrentBooking: (state) => {
            state.currentBooking = null;
        }
    }
});

export const {
    setLoading,
    setMyBookings,
    setCurrentBooking,
    addBooking,
    updateBooking,
    setError,
    clearError,
    clearCurrentBooking
} = bookingSlice.actions;

// Thunks
export const fetchMyBookings = (status = null) => async (dispatch) => {
    try {
        dispatch(setLoading(true));
        const bookingService = require('../../services/bookingService').default;
        const response = await bookingService.getMyBookings(status);
        dispatch(setMyBookings(response.data.bookings));
    } catch (error) {
        dispatch(setError(error.message));
    }
};

export const createNewBooking = (bookingData) => async (dispatch) => {
    try {
        dispatch(setLoading(true));
        const bookingService = require('../../services/bookingService').default;
        const response = await bookingService.createBooking(bookingData);
        dispatch(addBooking(response.data));
        return response.data;
    } catch (error) {
        dispatch(setError(error.message));
        throw error;
    }
};

export const cancelExistingBooking = (bookingId) => async (dispatch) => {
    try {
        dispatch(setLoading(true));
        const bookingService = require('../../services/bookingService').default;
        const response = await bookingService.cancelBooking(bookingId);
        dispatch(updateBooking(response.data));
    } catch (error) {
        dispatch(setError(error.message));
        throw error;
    }
};

export default bookingSlice.reducer;

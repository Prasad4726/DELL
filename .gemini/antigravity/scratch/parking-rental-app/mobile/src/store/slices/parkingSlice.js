import { createSlice } from '@reduxjs/toolkit';

/**
 * Parking Slice
 * Manages parking data state
 */

const initialState = {
    nearbyParkings: [],
    selectedParking: null,
    myParkings: [],
    loading: false,
    error: null,
    searchLocation: null
};

const parkingSlice = createSlice({
    name: 'parking',
    initialState,
    reducers: {
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setNearbyParkings: (state, action) => {
            state.nearbyParkings = action.payload;
            state.loading = false;
            state.error = null;
        },
        setSelectedParking: (state, action) => {
            state.selectedParking = action.payload;
        },
        setMyParkings: (state, action) => {
            state.myParkings = action.payload;
            state.loading = false;
        },
        setSearchLocation: (state, action) => {
            state.searchLocation = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
        clearError: (state) => {
            state.error = null;
        },
        clearParkings: (state) => {
            state.nearbyParkings = [];
            state.selectedParking = null;
        }
    }
});

export const {
    setLoading,
    setNearbyParkings,
    setSelectedParking,
    setMyParkings,
    setSearchLocation,
    setError,
    clearError,
    clearParkings
} = parkingSlice.actions;

// Thunks
export const fetchNearbyParkings = (latitude, longitude, radius, type) => async (dispatch) => {
    try {
        dispatch(setLoading(true));
        const parkingService = require('../../services/parkingService').default;
        const response = await parkingService.searchNearby(latitude, longitude, radius, type);
        dispatch(setNearbyParkings(response.data.parkings));
        dispatch(setSearchLocation({ latitude, longitude }));
    } catch (error) {
        dispatch(setError(error.message));
    }
};

export const fetchParkingById = (parkingId) => async (dispatch) => {
    try {
        dispatch(setLoading(true));
        const parkingService = require('../../services/parkingService').default;
        const response = await parkingService.getParkingById(parkingId);
        dispatch(setSelectedParking(response.data));
        dispatch(setLoading(false));
    } catch (error) {
        dispatch(setError(error.message));
    }
};

export const fetchMyParkings = () => async (dispatch) => {
    try {
        dispatch(setLoading(true));
        const parkingService = require('../../services/parkingService').default;
        const response = await parkingService.getMyParkings();
        dispatch(setMyParkings(response.data.parkings));
    } catch (error) {
        dispatch(setError(error.message));
    }
};

export default parkingSlice.reducer;

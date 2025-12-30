import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    lat: 28.6139,
    lon: 77.2090,
    name: "New Delhi",
    isAuto: true
};

const locationSlice = createSlice({
    name: 'location',
    initialState,
    reducers: {
        setLocation: (state, action) => {
            const { lat, lon, name } = action.payload;
            state.lat = lat;
            state.lon = lon;
            if (name) state.name = name;
            state.isAuto = false; // Manual update
        },
        setAutoLocation: (state, action) => {
            const { lat, lon } = action.payload;
            state.lat = lat;
            state.lon = lon;
            state.isAuto = true;
        }
    }
});

export const { setLocation, setAutoLocation } = locationSlice.actions;
export default locationSlice.reducer;

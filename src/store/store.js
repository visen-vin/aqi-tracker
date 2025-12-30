import { configureStore } from '@reduxjs/toolkit';
import { aqiApi } from './api/aqiApi';
import locationReducer from './slices/locationSlice';

export const store = configureStore({
    reducer: {
        [aqiApi.reducerPath]: aqiApi.reducer,
        location: locationReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(aqiApi.middleware),
});

# RTK Query & Redux State Management Implementation

This document outlines the implementation of Redux Toolkit (RTK) and RTK Query in the AQI Tracker application. This transition moves the application from ad-hoc data fetching to a robust, cached, and centralized state management system.

## 🚀 Overview

The implementation centralizes all data-related logic—fetching, caching, and state synchronization—into a unified Redux store. This ensures a "single source of truth" for the application's data, improved performance through caching, and a smoother user experience with automatic loading/error states.

## 🏗️ Architecture

### 1. Centralized Store (`src/store/store.js`)
The store is the hub of the application state. It integrates both the RTK Query API and standard slices.

```javascript
export const store = configureStore({
    reducer: {
        [aqiApi.reducerPath]: aqiApi.reducer,
        location: locationReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(aqiApi.middleware),
});
```

### 2. RTK Query API (`src/store/api/aqiApi.js`)
The `aqiApi` handles all network requests to Open-Meteo and BigDataCloud. It utilizes a custom `queryFn` to orchestrate multi-step data processing.

**Key Endpoints:**
- **getLiveData**: A comprehensive query that fetches current AQI, historical trends (31 days), weather conditions, and reverse-geocodes coordinates in a single hook call.
- **getRankings**: Fetches current AQI for a batch of cities (India/World) simultaneously using Open-Meteo's multi-coordinate query feature.
- **searchLocations**: A lazy query for city search and geocoding.
- `getReverseGeocode`: Converts coordinates to human-readable names.

**Features:**
- **Caching**: Data is cached per coordinate pair, reducing redundant API hits.
- **Tagging**: Uses `AQI`, `Weather`, and `Location` tags for intelligent cache invalidation.
- **Data Normalization**: Processes raw API responses into application-ready formats (e.g., calculating Indian AQI, unit conversions).

### 3. Location Slice (`src/store/slices/locationSlice.js`)
Manages the global location state, allowing different components to react to location changes.

- **State**: `lat`, `lon`, `name`, and `isAuto`.
- **Actions**: `setLocation` (manual) and `setAutoLocation` (browser geolocation).

## ✨ Key Features & Benefits

| Feature | Description |
| :--- | :--- |
| **Declarative Fetching** | Use simple hooks like `useGetLiveDataQuery()` instead of manual `useEffect` and `fetch`. |
| **Automatic Caching** | Results are stored and reused. Navigating between pages doesn't trigger unnecessary re-fetches. |
| **Loading/Error States** | Built-in `isLoading`, `isFetching`, and `isError` flags provided by RTK hooks. |
| **Optimized Historical Data** | Processes 31 days of hourly data to support 24h, 7d, and 30d chart views efficiently. |
| **Consistent AQI Logic** | All calculations (Indian Standard) are handled within the API layer before reaching components. |

## 🛠️ How to Use

### Fetching Dashboard Data
In any component, you can now access the full AQI and Weather state easily:

```javascript
const { lat, lon } = useSelector(state => state.location);
const { data, isLoading, error } = useGetLiveDataQuery({ lat, lon });

if (isLoading) return <LoadingSpinner />;
if (error) return <ErrorMessage error={error} />;

return <Dashboard data={data} />;
```

### Changing Location
Update the application's target location from a search bar or map:

```javascript
const dispatch = useDispatch();
const handleLocationSelect = (city) => {
    dispatch(setLocation({ 
        lat: city.latitude, 
        lon: city.longitude, 
        name: city.name 
    }));
};
```

## 📈 Future Roadmap
- **Polling**: Implement auto-refresh every 15 minutes for live data.
- **Persistence**: Persist the `location` state to `localStorage` so the app remembers the user's city.
- **Prefetching**: Prefetch data for "Rankings" or "News" on hover of navigation links.

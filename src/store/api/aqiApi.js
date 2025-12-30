import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { calculateIndianAQI, calculateUSEPA_AQI } from '../../utils/aqiUtils'; // Keep Indian for legacy if needed/comparison

// Default: New Delhi
const DEFAULT_LAT = 28.6139;
const DEFAULT_LON = 77.2090;

/* 
Unit Conversion Factors (Approximation at STP):
NO2: 1 ppb ~ 1.88 µg/m³  => µg = ppb * 1.88 => ppb = µg / 1.88
SO2: 1 ppb ~ 2.62 µg/m³
O3: 1 ppb ~ 2.00 µg/m³
CO: 1 ppm ~ 1.15 mg/m³ => mg = ppm * 1.15 => ppm = mg / 1.15
   (Also 1 ppm = 1000 ppb)
*/
function convertToDisplayUnits(rawPollutants) {
    // raw values: pm (µg), gases (µg), co (mg)
    return {
        pm25: Math.round(rawPollutants.pm25),
        pm10: Math.round(rawPollutants.pm10),
        no2: Math.round(rawPollutants.no2 / 1.88),
        so2: Math.round(rawPollutants.so2 / 2.62),
        co: Math.round((rawPollutants.co / 1.15) * 1000),
        o3: Math.round(rawPollutants.o3 / 2.00)
    };
}


// Internal Reference Lists for Rankings (To avoid external mock files)
const RANKING_COORDINATES = {
    india: [
        { name: "Aurangabad", lat: 19.8762, lon: 75.3433 },
        { name: "Gwalior", lat: 26.2124, lon: 78.1772 },
        { name: "Varanasi", lat: 25.3176, lon: 82.9739 },
        { name: "Shahjahanpur", lat: 27.8833, lon: 79.9167 },
        { name: "Noida", lat: 28.5355, lon: 77.3910 },
        { name: "Meerut", lat: 28.9845, lon: 77.7064 },
        { name: "Ghazipur", lat: 25.5833, lon: 83.5833 },
        { name: "Mirzapur", lat: 25.1500, lon: 82.5833 },
        { name: "Delhi", lat: 28.6139, lon: 77.2090 },
        { name: "Mumbai", lat: 19.0760, lon: 72.8777 },
        { name: "Kolkata", lat: 22.5726, lon: 88.3639 },
        { name: "Bangalore", lat: 12.9716, lon: 77.5946 },
        { name: "Lucknow", lat: 26.8467, lon: 80.9462 },
        { name: "Kanpur", lat: 26.4499, lon: 80.3319 },
        { name: "Patna", lat: 25.5941, lon: 85.1376 },
        { name: "Bhopal", lat: 23.2599, lon: 77.4126 },
        { name: "Indore", lat: 22.7196, lon: 75.8577 },
        { name: "Agra", lat: 27.1767, lon: 78.0081 },
        { name: "Ghaziabad", lat: 28.6692, lon: 77.4538 },
        { name: "Faridabad", lat: 28.4089, lon: 77.3178 },
        { name: "Ludhiana", lat: 30.9010, lon: 75.8573 },
        { name: "Nashik", lat: 19.9975, lon: 73.7898 },
        { name: "Rajkot", lat: 22.3039, lon: 70.8022 },
        { name: "Srinagar", lat: 34.0837, lon: 74.7973 },
        { name: "Allahabad", lat: 25.4358, lon: 81.8463 },
        { name: "Ranchi", lat: 23.3441, lon: 85.3096 },
        { name: "Howrah", lat: 22.5769, lon: 88.3186 },
        { name: "Jabalpur", lat: 23.1815, lon: 79.9864 },
        { name: "Coimbatore", lat: 11.0168, lon: 76.9558 },
        { name: "Vijayawada", lat: 16.5062, lon: 80.6480 },
        { name: "Madurai", lat: 9.9252, lon: 78.1198 },
        { name: "Guwahati", lat: 26.1445, lon: 91.7362 },
        { name: "Chandigarh", lat: 30.7333, lon: 76.7794 },
        { name: "Hubli", lat: 15.3647, lon: 75.1240 },
        { name: "Mysore", lat: 12.2958, lon: 76.6394 },
        { name: "Tiruchirappalli", lat: 10.7905, lon: 78.7047 },
        { name: "Bareilly", lat: 28.3670, lon: 79.4304 },
        { name: "Aligarh", lat: 27.8837, lon: 78.0800 }
    ],
    world: [
        { name: "Tokyo", lat: 35.6895, lon: 139.6917 },
        { name: "New York", lat: 40.7128, lon: -74.0060 },
        { name: "London", lat: 51.5074, lon: -0.1278 },
        { name: "Paris", lat: 48.8566, lon: 2.3522 },
        { name: "Beijing", lat: 39.9042, lon: 116.4074 },
        { name: "Dubai", lat: 25.2048, lon: 55.2708 },
        { name: "Singapore", lat: 1.3521, lon: 103.8198 },
        { name: "Sydney", lat: -33.8688, lon: 151.2093 },
        { name: "Mexico City", lat: 19.4326, lon: -99.1332 },
        { name: "Sao Paulo", lat: -23.5505, lon: -46.6333 },
        { name: "Cairo", lat: 30.0444, lon: 31.2357 },
        { name: "Moscow", lat: 55.7558, lon: 37.6173 },
        { name: "Seoul", lat: 37.5665, lon: 126.9780 },
        { name: "Bangkok", lat: 13.7563, lon: 100.5018 },
        { name: "Los Angeles", lat: 34.0522, lon: -118.2437 },
        { name: "Istanbul", lat: 41.0082, lon: 28.9784 },
        { name: "Hong Kong", lat: 22.3193, lon: 114.1694 },
        { name: "Berlin", lat: 52.5200, lon: 13.4050 },
        { name: "Buenos Aires", lat: -34.6037, lon: -58.3816 },
        { name: "Lahore", lat: 31.5204, lon: 74.3587 },
        { name: "Jakarta", lat: -6.2088, lon: 106.8456 },
        { name: "Shanghai", lat: 31.2304, lon: 121.4737 },
        { name: "Karachi", lat: 24.8607, lon: 67.0011 },
        { name: "Manila", lat: 14.5995, lon: 120.9842 },
        { name: "Chicago", lat: 41.8781, lon: -87.6298 },
        { name: "Toronto", lat: 43.6532, lon: -79.3832 },
        { name: "Madrid", lat: 40.4168, lon: -3.7038 },
        { name: "Rome", lat: 41.9028, lon: 12.4964 },
        { name: "Riyadh", lat: 24.7136, lon: 46.6753 },
        { name: "Tel Aviv", lat: 32.0853, lon: 34.7818 },
        { name: "Amsterdam", lat: 52.3676, lon: 4.9041 },
        { name: "Stockholm", lat: 59.3293, lon: 18.0686 },
        { name: "Athens", lat: 37.9838, lon: 23.7275 },
        { name: "Lima", lat: -12.0464, lon: -77.0428 },
        { name: "Bogota", lat: 4.7110, lon: -74.0721 }
    ]
};


export const aqiApi = createApi({
    reducerPath: 'aqiApi',
    baseQuery: fetchBaseQuery({ baseUrl: '/' }),
    tagTypes: ['AQI', 'Weather', 'Location'],
    endpoints: (builder) => ({
        // Get AQI data for a location
        getAQIData: builder.query({
            queryFn: async ({ lat = DEFAULT_LAT, lon = DEFAULT_LON } = {}) => {
                try {
                    const aqiUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone&hourly=pm10,pm2_5&past_days=31&timezone=Asia%2FKolkata`;
                    const response = await fetch(aqiUrl);
                    const data = await response.json();
                    if (!data.current) throw new Error('Incomplete AQI data received');
                    return { data };
                } catch (error) {
                    return { error: { status: 'CUSTOM_ERROR', error: error.message } };
                }
            },
            providesTags: ['AQI'],
        }),

        // Get weather data for a location
        getWeatherData: builder.query({
            queryFn: async ({ lat = DEFAULT_LAT, lon = DEFAULT_LON } = {}) => {
                try {
                    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m&timezone=Asia%2FKolkata`;
                    const response = await fetch(weatherUrl);
                    const data = await response.json();
                    if (!data.current) throw new Error('Incomplete weather data received');
                    return { data };
                } catch (error) {
                    return { error: { status: 'CUSTOM_ERROR', error: error.message } };
                }
            },
            providesTags: ['Weather'],
        }),

        // Reverse geocode location
        getReverseGeocode: builder.query({
            queryFn: async ({ lat, lon }) => {
                try {
                    const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`;
                    const response = await fetch(url);
                    const data = await response.json();
                    const locality = data.locality || data.city || "";
                    const city = data.city || data.principalSubdivision || "Unknown Location";
                    return { data: { city, locality } };
                } catch (error) {
                    return { data: { city: "Your Location", locality: `${lat.toFixed(4)}, ${lon.toFixed(4)}` } };
                }
            },
            providesTags: ['Location'],
        }),

        // Search locations
        searchLocations: builder.query({
            queryFn: async (query) => {
                if (!query || query.length < 3) return { data: [] };
                try {
                    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=en&format=json`;
                    const response = await fetch(url);
                    const data = await response.json();
                    return { data: data.results || [] };
                } catch (error) {
                    return { error: { status: 'CUSTOM_ERROR', error: error.message } };
                }
            },
        }),

        // Combined query for complete live data
        getLiveData: builder.query({
            queryFn: async ({ lat = DEFAULT_LAT, lon = DEFAULT_LON } = {}) => {
                try {
                    const aqiUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone&hourly=pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone&past_days=31&timezone=Asia%2FKolkata`;
                    const aqiRes = await fetch(aqiUrl);
                    const aqiData = await aqiRes.json();

                    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m&timezone=Asia%2FKolkata`;
                    const weatherRes = await fetch(weatherUrl);
                    const weatherData = await weatherRes.json();

                    if (!aqiData.current || !weatherData.current) throw new Error('Incomplete data received');

                    const current = aqiData.current;
                    const weather = weatherData.current;

                    const rawPollutants = {
                        pm25: current.pm2_5,
                        pm10: current.pm10,
                        no2: current.nitrogen_dioxide,
                        so2: current.sulphur_dioxide,
                        co: current.carbon_monoxide / 1000,
                        o3: current.ozone
                    };

                    const aqiResult = calculateUSEPA_AQI(rawPollutants);
                    const displayPollutants = convertToDisplayUnits(rawPollutants);

                    const isDefault = Math.abs(lat - DEFAULT_LAT) < 0.001 && Math.abs(lon - DEFAULT_LON) < 0.001;
                    let locationName = { city: "New Delhi", locality: "New Delhi" };

                    if (!isDefault) {
                        try {
                            const geoUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`;
                            const geoRes = await fetch(geoUrl);
                            const geoData = await geoRes.json();
                            const locality = geoData.locality || geoData.city || "";
                            const city = geoData.city || geoData.principalSubdivision || "Unknown Location";
                            locationName = { city, locality };
                        } catch (error) {
                            locationName = { city: "Your Location", locality: `${lat.toFixed(4)}, ${lon.toFixed(4)}` };
                        }
                    }

                    let fullHistory = [];
                    if (aqiData.hourly && aqiData.hourly.time) {
                        const h = aqiData.hourly;
                        fullHistory = h.time.map((t, index) => {
                            const pointPollutants = {
                                pm25: h.pm2_5 ? h.pm2_5[index] : undefined,
                                pm10: h.pm10 ? h.pm10[index] : undefined,
                                no2: h.nitrogen_dioxide ? h.nitrogen_dioxide[index] : undefined,
                                so2: h.sulphur_dioxide ? h.sulphur_dioxide[index] : undefined,
                                co: h.carbon_monoxide ? (h.carbon_monoxide[index] / 1000) : undefined,
                                o3: h.ozone ? h.ozone[index] : undefined
                            };
                            const pointAQI = calculateUSEPA_AQI(pointPollutants);
                            const dateObj = new Date(t);
                            return {
                                timestamp: t,
                                time: dateObj.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true }),
                                fullDate: dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                                hour: dateObj.getHours(),
                                aqi: pointAQI.aqi,
                                pm25: pointPollutants.pm25 ? Math.round(pointPollutants.pm25) : 0,
                                pm10: pointPollutants.pm10 ? Math.round(pointPollutants.pm10) : 0
                            };
                        });
                        const now = new Date();
                        fullHistory = fullHistory.filter(item => new Date(item.timestamp) <= now);
                    }

                    const result = {
                        name: locationName.city,
                        location: locationName.locality || `${lat.toFixed(4)}, ${lon.toFixed(4)}`,
                        aqi: aqiResult.aqi,
                        status: aqiResult.status,
                        lastUpdated: aqiData.current.time,
                        weather: {
                            temp: Math.round(weather.temperature_2m),
                            humidity: weather.relative_humidity_2m,
                            wind: weather.wind_speed_10m,
                            uv: 2,
                            condition: "Mist"
                        },
                        pollutants: displayPollutants,
                        history: fullHistory,
                        trend: fullHistory.slice(-24)
                    };
                    return { data: result };
                } catch (error) {
                    return { error: { status: 'CUSTOM_ERROR', error: error.message } };
                }
            },
            providesTags: ['AQI', 'Weather', 'Location'],
        }),



        // ... inside endpoints ...
        // Fetch rankings for a region
        getRankings: builder.query({
            queryFn: async (region = 'india') => {
                const targetCities = RANKING_COORDINATES[region] || RANKING_COORDINATES['india'];

                if (!targetCities || targetCities.length === 0) return { data: [] };

                try {
                    const lats = targetCities.map(c => c.lat).join(',');
                    const lons = targetCities.map(c => c.lon).join(',');
                    const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lats}&longitude=${lons}&current=pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone&timezone=Asia%2FKolkata`;

                    const response = await fetch(url);
                    const data = await response.json();
                    const results = Array.isArray(data) ? data : [data];

                    const rankedData = results.map((item, index) => {
                        const current = item.current;
                        const rawPollutants = {
                            pm25: current.pm2_5,
                            pm10: current.pm10,
                            no2: current.nitrogen_dioxide,
                            so2: current.sulphur_dioxide,
                            co: current.carbon_monoxide / 1000,
                            o3: current.ozone
                        };
                        const aqiResult = calculateUSEPA_AQI(rawPollutants);
                        return {
                            name: targetCities[index].name,
                            aqi: aqiResult.aqi,
                            status: aqiResult.status,
                            lastUpdated: current.time,
                            lat: targetCities[index].lat,
                            lon: targetCities[index].lon
                        };
                    });

                    // Sort: Highest AQI (worst) first
                    rankedData.sort((a, b) => b.aqi - a.aqi);
                    return { data: rankedData };
                } catch (error) {
                    console.error("Rankings API Error:", error);
                    return { error: { status: 'CUSTOM_ERROR', error: error.message } };
                }
            },
            providesTags: ['AQI'],
        }),
    }),
});

export const {
    useGetAQIDataQuery,
    useGetWeatherDataQuery,
    useGetReverseGeocodeQuery,
    useGetLiveDataQuery,
    useLazySearchLocationsQuery,
    useGetRankingsQuery,
} = aqiApi;

import { calculateIndianAQI } from '../utils/aqiUtils';

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
        co: Math.round(rawPollutants.co / 1.15),
        o3: Math.round(rawPollutants.o3 / 2.00)
    };
}

// Helper to reverse geocode
const fetchCityName = async (lat, lon) => {
    try {
        const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`;
        const res = await fetch(url);
        const data = await res.json();
        const locality = data.locality || data.city || "";
        const city = data.city || data.principalSubdivision || "Unknown Location";
        return { city, locality };
    } catch (error) {
        console.error("Reverse Geocoding failed", error);
        return { city: "Your Location", locality: `${lat.toFixed(4)}, ${lon.toFixed(4)}` };
    }
};

export const fetchLiveData = async ({ lat = DEFAULT_LAT, lon = DEFAULT_LON } = {}) => {
    try {
        // Fetch 31 days of history for chart flexibility (24h, 7d, 30d views)
        const aqiUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone&hourly=pm10,pm2_5&past_days=31&timezone=Asia%2FKolkata`;
        const aqiRes = await fetch(aqiUrl);
        const aqiData = await aqiRes.json();

        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m&timezone=Asia%2FKolkata`;
        const weatherRes = await fetch(weatherUrl);
        const weatherData = await weatherRes.json();

        if (!aqiData.current || !weatherData.current) {
            throw new Error('Incomplete data received');
        }

        const current = aqiData.current;
        const weather = weatherData.current;

        const rawPollutants = {
            pm25: current.pm2_5,
            pm10: current.pm10,
            no2: current.nitrogen_dioxide,
            so2: current.sulphur_dioxide,
            co: current.carbon_monoxide,
            o3: current.ozone
        };

        const aqiResult = calculateIndianAQI(rawPollutants);
        const displayPollutants = convertToDisplayUnits(rawPollutants);

        const isDefault = Math.abs(lat - DEFAULT_LAT) < 0.001 && Math.abs(lon - DEFAULT_LON) < 0.001;
        let locationName = { city: "New Delhi", locality: "New Delhi" };

        if (!isDefault) {
            locationName = await fetchCityName(lat, lon);
        }

        // Process Historical Trend Data
        let fullHistory = [];
        if (aqiData.hourly && aqiData.hourly.pm2_5) {
            const pm25Data = aqiData.hourly.pm2_5;
            const pm10Data = aqiData.hourly.pm10 || [];
            const times = aqiData.hourly.time || [];

            fullHistory = pm25Data.map((val, index) => {
                const dateObj = new Date(times[index]);
                return {
                    timestamp: times[index],
                    // For short charts, hour is enough. For long chats, we need date.
                    time: dateObj.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true }),
                    fullDate: dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                    hour: dateObj.getHours(),
                    aqi: Math.round(val), // Proxy
                    pm25: Math.round(val),
                    pm10: pm10Data[index] ? Math.round(pm10Data[index]) : 0
                };
            });
        }

        return {
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
            // Pass the full hourly history (~744 points)
            history: fullHistory,
            // Keep 'trend' as last 24h for backwards compat
            trend: fullHistory.slice(-24)
        };

    } catch (error) {
        console.error("Failed to fetch live data", error);
        return null;
    }
};

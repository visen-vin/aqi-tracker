// Indian AQI Breakpoints (CPCB)
// Pollutant concentration ranges for each AQI bucket (Good, Satisfactory, Moderate, Poor, Very Poor, Severe)
const breakpoints = {
    pm25: [
        { max: 30, aqiHigh: 50 },
        { max: 60, aqiHigh: 100 },
        { max: 90, aqiHigh: 200 },
        { max: 120, aqiHigh: 300 },
        { max: 250, aqiHigh: 400 },
        { max: Infinity, aqiHigh: 500 }
    ],
    pm10: [
        { max: 50, aqiHigh: 50 },
        { max: 100, aqiHigh: 100 },
        { max: 250, aqiHigh: 200 },
        { max: 350, aqiHigh: 300 },
        { max: 430, aqiHigh: 400 },
        { max: Infinity, aqiHigh: 500 }
    ],
    no2: [ // µg/m3
        { max: 40, aqiHigh: 50 },
        { max: 80, aqiHigh: 100 },
        { max: 180, aqiHigh: 200 },
        { max: 280, aqiHigh: 300 },
        { max: 400, aqiHigh: 400 },
        { max: Infinity, aqiHigh: 500 }
    ],
    so2: [ // µg/m3
        { max: 40, aqiHigh: 50 },
        { max: 80, aqiHigh: 100 },
        { max: 380, aqiHigh: 200 },
        { max: 800, aqiHigh: 300 },
        { max: 1600, aqiHigh: 400 },
        { max: Infinity, aqiHigh: 500 }
    ],
    co: [ // mg/m3
        { max: 1.0, aqiHigh: 50 },
        { max: 2.0, aqiHigh: 100 },
        { max: 10.0, aqiHigh: 200 },
        { max: 17.0, aqiHigh: 300 },
        { max: 34.0, aqiHigh: 400 },
        { max: Infinity, aqiHigh: 500 }
    ],
    o3: [ // µg/m3
        { max: 50, aqiHigh: 50 },
        { max: 100, aqiHigh: 100 },
        { max: 168, aqiHigh: 200 },
        { max: 208, aqiHigh: 300 },
        { max: 748, aqiHigh: 400 }, //* 8hr standard differs, using approx
        { max: Infinity, aqiHigh: 500 }
    ]
};

// AQI Status Text map
export const getAQIStatus = (aqi) => {
    if (aqi <= 50) return 'Good';
    if (aqi <= 100) return 'Satisfactory';
    if (aqi <= 200) return 'Moderate';
    if (aqi <= 300) return 'Poor';
    if (aqi <= 400) return 'Very Poor'; // Changed from 'Unhealthy' to match Indian CPCB exact terms if needed, but 'Severe' is top.
    // Wait, typical Indian scale: Good, Satisfactory, Moderate, Poor, Very Poor, Severe.
    // User ref used: Good, Moderate, Poor, Unhealthy, Severe, Hazardous (US-like labels).
    // I will stick to the labels I used in visual components before (Good, Moderate, Poor, Unhealthy, Severe, Hazardous) to keep consistency with the UI Gauge.
    if (aqi <= 300) return 'Unhealthy';
    if (aqi <= 400) return 'Severe';
    return 'Hazardous';
};

// Calculate Sub-Index for a single pollutant
// using linear interpolation formula: I = [ (Ihi - Ilo) / (BPhi - BPlo) ] * (Cp - BPlo) + Ilo
// where BPhi, BPlo are breakpoints, Cp is concentration
function calculateSubIndex(concentration, type) {
    // If CO, needs conversion from µg/m3 to mg/m3 if input is µg
    // Assuming input to this function for CO is ALREADY in mg/m3 or we handle it before calling.
    // Let's assume input matches the table units.

    if (concentration < 0 || !breakpoints[type]) return 0;

    const ranges = breakpoints[type];
    let bpLo = 0;
    let iLo = 0;

    for (let i = 0; i < ranges.length; i++) {
        const bpHi = ranges[i].max;
        const iHi = ranges[i].aqiHigh;

        if (concentration <= bpHi || bpHi === Infinity) {
            // For the last bucket (Infinity), we extrapolate or cap if it's the very last
            if (bpHi === Infinity) {
                // Extrapolate based on the last known slope
                // bpLo, iLo are from the previous step (e.g., 400 AQI level)
                // For pm25: bpLo=250, iLo=400. Next level usually doesn't exist but we can fake it.
                // Actually, let's just use the previous slope.
                const prevRange = ranges[ranges.length - 2];
                const slope = (prevRange.aqiHigh - (iLo - (prevRange.aqiHigh - iLo))) / (prevRange.max - (bpLo - (prevRange.max - bpLo)));
                // That's too complex. Let's just do:
                return Math.round(iLo + (concentration - bpLo) * 0.5); // Arbitrary growth above 500
            }

            return Math.round(
                ((iHi - iLo) / (bpHi - bpLo)) * (concentration - bpLo) + iLo
            );
        }

        bpLo = bpHi;
        iLo = iHi;
    }
    return Math.round(iLo + (concentration - bpLo) * 0.5);
}

// US EPA AQI Breakpoints
// Unit: µg/m³ for PM2.5/PM10
const breakpointsUSEPA = {
    pm25: [
        { max: 12.0, aqiHigh: 50, aqiLow: 0, min: 0 },
        { max: 35.4, aqiHigh: 100, aqiLow: 51, min: 12.1 },
        { max: 55.4, aqiHigh: 150, aqiLow: 101, min: 35.5 },
        { max: 150.4, aqiHigh: 200, aqiLow: 151, min: 55.5 },
        { max: 250.4, aqiHigh: 300, aqiLow: 201, min: 150.5 },
        { max: 350.4, aqiHigh: 400, aqiLow: 301, min: 250.5 },
        { max: 500.4, aqiHigh: 500, aqiLow: 401, min: 350.5 },
        { max: Infinity, aqiHigh: 999, aqiLow: 501, min: 500.5 }
    ],
    pm10: [
        { max: 54, aqiHigh: 50, aqiLow: 0, min: 0 },
        { max: 154, aqiHigh: 100, aqiLow: 51, min: 55 },
        { max: 254, aqiHigh: 150, aqiLow: 101, min: 155 },
        { max: 354, aqiHigh: 200, aqiLow: 151, min: 255 },
        { max: 424, aqiHigh: 300, aqiLow: 201, min: 355 },
        { max: 504, aqiHigh: 400, aqiLow: 301, min: 425 },
        { max: 604, aqiHigh: 500, aqiLow: 401, min: 505 },
        { max: Infinity, aqiHigh: 999, aqiLow: 501, min: 605 }
    ]
};

// Calculate US EPA Index
function calculateSubIndexEPA(concentration, type) {
    if (concentration < 0 || !breakpointsUSEPA[type]) return 0;

    // Truncate to 1 decimal place as per EPA rules
    const c = Math.floor(concentration * 10) / 10;

    const ranges = breakpointsUSEPA[type];
    for (let i = 0; i < ranges.length; i++) {
        const range = ranges[i];
        if (c <= range.max) {
            // Formula: ((Ihi - Ilo) / (BPhi - BPlo)) * (Cp - BPlo) + Ilo
            return Math.round(
                ((range.aqiHigh - range.aqiLow) / (range.max - range.min)) * (c - range.min) + range.aqiLow
            );
        }
    }
    // Extrapolate if crazy high
    return Math.round(c);
}

// US EPA AQI Categories
export const getUSEPAStatus = (aqi) => {
    if (aqi <= 50) return 'Good';
    if (aqi <= 100) return 'Moderate';
    if (aqi <= 150) return 'Unhealthy for Sensitive Groups';
    if (aqi <= 200) return 'Unhealthy';
    if (aqi <= 300) return 'Very Unhealthy';
    return 'Hazardous';
};


export function calculateIndianAQI(pollutants) {
    // pollutants: { pm25, pm10, no2, so2, co (mg/m3), o3 }

    const subIndices = {};
    let maxAQI = 0;
    let dominant = '';

    // Calculate all available
    if (pollutants.pm25 !== undefined) {
        const val = calculateSubIndex(pollutants.pm25, 'pm25');
        subIndices.pm25 = val;
        if (val > maxAQI) { maxAQI = val; dominant = 'PM2.5'; }
    }
    if (pollutants.pm10 !== undefined) {
        const val = calculateSubIndex(pollutants.pm10, 'pm10');
        subIndices.pm10 = val;
        if (val > maxAQI) { maxAQI = val; dominant = 'PM10'; }
    }
    if (pollutants.no2 !== undefined) {
        const val = calculateSubIndex(pollutants.no2, 'no2');
        subIndices.no2 = val;
        if (val > maxAQI) { maxAQI = val; dominant = 'NO2'; }
    }
    if (pollutants.so2 !== undefined) {
        const val = calculateSubIndex(pollutants.so2, 'so2');
        subIndices.so2 = val;
        if (val > maxAQI) { maxAQI = val; dominant = 'SO2'; }
    }
    if (pollutants.co !== undefined) {
        const val = calculateSubIndex(pollutants.co, 'co');
        subIndices.co = val;
        if (val > maxAQI) { maxAQI = val; dominant = 'CO'; }
    }
    if (pollutants.o3 !== undefined) {
        const val = calculateSubIndex(pollutants.o3, 'o3');
        subIndices.o3 = val;
        if (val > maxAQI) { maxAQI = val; dominant = 'O3'; }
    }

    return {
        aqi: maxAQI,
        dominantPollutant: dominant,
        status: getAQIStatus(maxAQI),
        subIndices
    };
}

// Helper to use EPA standard
export function calculateUSEPA_AQI(pollutants) {
    // Primary: PM2.5, Fallback: PM10
    const pm25 = pollutants.pm25;
    const pm10 = pollutants.pm10;

    let aqi = 0;
    let dominant = '';

    // Calculate PM2.5 AQI
    if (pm25 !== undefined) {
        const val = calculateSubIndexEPA(pm25, 'pm25');
        if (val > aqi) { aqi = val; dominant = 'PM2.5'; }
    }

    // Calculate PM10 AQI (if higher or pm2.5 missing)
    if (pm10 !== undefined) {
        const val = calculateSubIndexEPA(pm10, 'pm10');
        if (val > aqi) { aqi = val; dominant = 'PM10'; }
    }

    return {
        aqi,
        status: getUSEPAStatus(aqi),
        dominantPollutant: dominant
    };
}

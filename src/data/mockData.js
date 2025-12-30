export const cities = [
    {
        id: 'mumbai',
        name: 'Mumbai',
        aqi: 388,
        status: 'Severe',
        lastUpdated: '2025-10-24T10:30:00',
        weather: { temp: 30, humidity: 70, wind: 15 },
        pollutants: { pm25: 234, pm10: 297, no2: 45, so2: 8, co: 400, o3: 30 },
        trend: [140, 145, 156, 160, 155, 150, 148, 145, 142, 140, 138, 135, 132, 130, 135, 140, 145, 150, 155, 156, 158, 160, 155, 150]
    },
    {
        id: 'delhi',
        name: 'New Delhi',
        aqi: 342,
        status: 'Severe',
        lastUpdated: '2025-10-24T10:30:00',
        weather: { temp: 28, humidity: 45, wind: 12 },
        pollutants: { pm25: 185, pm10: 240, no2: 65, so2: 12, co: 800, o3: 45 },
        trend: [320, 335, 342, 330, 315, 305, 290, 295, 300, 310, 320, 330, 340, 345, 350, 348, 345, 340, 335, 330, 325, 320, 325, 330]
    },
    {
        id: 'bangalore',
        name: 'Bangalore',
        aqi: 65,
        status: 'Moderate',
        lastUpdated: '2025-10-24T10:30:00',
        weather: { temp: 24, humidity: 55, wind: 18 },
        pollutants: { pm25: 25, pm10: 45, no2: 20, so2: 5, co: 300, o3: 25 },
        trend: [60, 62, 65, 68, 64, 60, 58, 55, 52, 50, 52, 55, 58, 60, 62, 65, 68, 70, 68, 65, 62, 60, 58, 60]
    },
    {
        id: 'chennai',
        name: 'Chennai',
        aqi: 85,
        status: 'Moderate',
        lastUpdated: '2025-10-24T10:30:00',
        weather: { temp: 31, humidity: 75, wind: 20 },
        pollutants: { pm25: 35, pm10: 60, no2: 15, so2: 10, co: 200, o3: 20 },
        trend: [80, 82, 85, 88, 85, 80, 78, 75, 72, 70, 72, 75, 78, 80, 82, 85, 88, 90, 88, 85, 82, 80, 78, 80]
    }
];

export const getAQIColor = (aqi) => {
    if (aqi > 400) return 'var(--aqi-hazardous)';
    if (aqi > 300) return 'var(--aqi-severe)';
    if (aqi > 200) return 'var(--aqi-unhealthy)';
    if (aqi > 100) return 'var(--aqi-poor)';
    if (aqi > 50) return 'var(--aqi-moderate)';
    return 'var(--aqi-good)';
};

export const getAQIStatus = (aqi) => {
    if (aqi > 400) return 'Hazardous';
    if (aqi > 300) return 'Severe';
    if (aqi > 200) return 'Unhealthy';
    if (aqi > 100) return 'Poor';
    if (aqi > 50) return 'Moderate';
    return 'Good';
}

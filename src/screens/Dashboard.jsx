import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setAutoLocation } from '../store/slices/locationSlice';
import { AQIGauge } from '../components/dashboard/AQIGauge';
import { PollutantBreakdown } from '../components/dashboard/PollutantBreakdown';
import { TrendChart } from '../components/dashboard/TrendChart';
import { CityComparison } from '../components/dashboard/CityComparison';
import { HealthTips } from '../components/dashboard/HealthTips';
import { useGetLiveDataQuery, useGetRankingsQuery } from '../store/api/aqiApi';

// Default: New Delhi
const DEFAULT_LAT = 28.6139;
const DEFAULT_LON = 77.2090;

export function Dashboard() {
    const dispatch = useDispatch();
    const coordinates = useSelector((state) => state.location);
    const [hasAttemptedGeolocation, setHasAttemptedGeolocation] = useState(false);

    // Use RTK Query hook to fetch live data
    const { data: liveData, isLoading, error, refetch } = useGetLiveDataQuery({ lat: coordinates.lat, lon: coordinates.lon });

    // Fetch a few cities for comparison
    const { data: rankings, isLoading: isLoadingComp } = useGetRankingsQuery('india');
    const comparisonData = rankings ? rankings.slice(0, 3) : [];

    // Merge live data with mock data for fallback
    const selectedCity = liveData || {
        name: coordinates.name || "Loading...",
        location: `${coordinates.lat.toFixed(2)}, ${coordinates.lon.toFixed(2)}`,
        aqi: 0,
        status: "Updating...",
        pollutants: {},
        weather: { temp: '--', humidity: '--', wind: '--' },
        history: [],
        trend: []
    };

    // Auto-detect location on mount
    useEffect(() => {
        if (hasAttemptedGeolocation) return;

        const detectLocation = () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const { latitude, longitude } = position.coords;
                        console.log('User location obtained:', latitude, longitude);
                        dispatch(setAutoLocation({ lat: latitude, lon: longitude }));
                        setHasAttemptedGeolocation(true);
                    },
                    (error) => {
                        console.log('Geolocation error or denied:', error.message);
                        // Use default location (New Delhi) which is already in initial state
                        setHasAttemptedGeolocation(true);
                    },
                    {
                        enableHighAccuracy: true,
                        timeout: 10000,
                        maximumAge: 0
                    }
                );
            } else {
                console.log('Geolocation not supported by browser');
                setHasAttemptedGeolocation(true);
            }
        };

        detectLocation();
    }, [hasAttemptedGeolocation, dispatch]);

    // Handle manual location request
    const handleLocateMe = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    console.log('Manual location request:', latitude, longitude);
                    dispatch(setAutoLocation({ lat: latitude, lon: longitude }));
                },
                (error) => {
                    console.error("Geolocation error:", error);
                    alert("Unable to retrieve your location.");
                }
            );
        } else {
            alert("Geolocation is not supported by this browser.");
        }
    };

    return (
        <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section: Main Panel (Live) */}
            <section id="live" className="mb-12">
                <AQIGauge city={selectedCity} onLocate={handleLocateMe} isLoading={isLoading} />
            </section>

            {/* Section: Pollutant Breakdown */}
            <section className="mb-12">
                <PollutantBreakdown pollutants={selectedCity.pollutants} location={selectedCity.location} />
            </section>

            {/* Section: Trends */}
            <section className="mb-12">
                <TrendChart data={selectedCity.trend} history={selectedCity.history} isLoading={isLoading} />
            </section>

            {/* Section: Comparison */}
            <section className="mb-12">
                <CityComparison cities={comparisonData || []} isLoading={isLoadingComp} />
            </section>

            {/* Section: Health */}
            <section className="mb-12">
                <HealthTips city={selectedCity} />
            </section>

        </div>
    );
}

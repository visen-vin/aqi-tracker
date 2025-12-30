import { motion } from 'framer-motion';
import { MapPin, RefreshCw, Wind, Droplets, Sun, Cloud, ArrowUpRight, Thermometer, LocateFixed } from 'lucide-react';
import { getAQIColor } from '../../data/mockData';

export function AQIGauge({ city, onLocate, isLoading }) {
    const theme = getAQITheme(city.aqi);
    const percentage = Math.min((city.aqi / 500) * 100, 100);
    // Indicator position calculation
    const indicatorLeft = `calc(${percentage}% - 6px)`;

    return (
        <div className="w-full font-sans">
            <div
                className={`relative overflow-hidden rounded-[32px] p-5 md:p-6 shadow-2xl transition-colors duration-500 ease-in-out font-sans`}
                style={{
                    background: theme.gradient,
                    color: 'white'
                }}
            >
                {/* Background Pattern */}
                <div className="absolute inset-0 z-0 pointer-events-none opacity-5"
                    style={{
                        backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
                        backgroundSize: '24px 24px'
                    }}
                />

                <div className="relative z-10 flex flex-col h-full">

                    {/* City Header (New) */}
                    <div className="flex flex-col mb-6">
                        <div className="flex justify-between items-start gap-4">
                            <div className="flex flex-col">
                                <h2 className="text-xl md:text-2xl font-bold text-white leading-tight tracking-tight">
                                    {city.name} Air Quality Index (AQI) | Live
                                </h2>
                                <div className="flex items-center gap-2 mt-1">
                                    <MapPin size={14} className="text-white/70" />
                                    <span className="text-white/70 text-xs md:text-sm font-medium">{city.location} · Real-time AQI</span>
                                </div>
                            </div>

                            {/* Locate Me Button */}
                            <button
                                onClick={onLocate}
                                disabled={isLoading}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 transition-colors rounded-full text-xs font-semibold backdrop-blur-md border border-white/10 disabled:opacity-50 shrink-0"
                            >
                                <LocateFixed size={14} className={isLoading ? "animate-spin" : ""} />
                                <span>{isLoading ? "Locating..." : "Locate Me"}</span>
                            </button>
                        </div>
                    </div>

                    {/* Header: Live AQI Label Only */}
                    <div className="flex justify-between items-center mb-1">
                        <div className="flex items-center gap-2">
                            {/* Red Dot Icon with Animation */}
                            <div className="relative flex h-4 w-4">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                                <div className="relative inline-flex h-4 w-4 rounded-full bg-red-500 border-[3px] border-red-900/30 items-center justify-center">
                                    <div className="h-1.5 w-1.5 rounded-full bg-white/40"></div>
                                </div>
                            </div>
                            <span className="font-bold text-[15px] tracking-wide text-white">Live AQI</span>
                        </div>
                        {/* 'Air Quality is' removed from here */}
                    </div>

                    {/* Main Row: Big Number & Status Badge */}
                    <div className="flex flex-row justify-between items-end mb-6 relative">
                        {/* AQI Number */}
                        <div className="flex items-baseline">
                            <span
                                className="text-6xl md:text-[90px] leading-none font-bold tracking-normal drop-shadow-sm transition-all"
                                style={{ color: theme.textColor }}
                            >
                                {city.aqi}
                            </span>
                            <span className="text-[10px] font-medium opacity-60 ml-1 relative top-[-5px] md:top-[-10px] whitespace-nowrap">(AQI-IN)</span>
                        </div>

                        {/* Status Badge & Label */}
                        <div className="flex flex-col items-end mb-2 md:mb-4 gap-1">
                            <span className="text-white/80 text-[10px] md:text-[13px] font-medium mr-1">Air Quality is</span>
                            <div
                                className="px-2 py-1.5 md:px-5 md:py-2 rounded-lg text-sm md:text-lg font-bold tracking-wide shadow-md min-w-[80px] md:min-w-[120px] text-center whitespace-nowrap"
                                style={{
                                    backgroundColor: theme.badgeBg,
                                    color: theme.badgeText
                                }}
                            >
                                {city.status}
                            </div>
                        </div>
                    </div>

                    {/* Pollutants Row */}
                    <div className="flex justify-between items-center text-sm font-medium mb-6 md:mb-8 px-1">
                        <div className="flex items-center gap-2">
                            <span className="text-white/60 font-bold">PM10 :</span>
                            <span className="font-bold text-white text-[15px]">{city.pollutants.pm10} µg/m³</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-white/60 font-bold">PM2.5 :</span>
                            <span className="font-bold text-white text-[15px]">{city.pollutants.pm25} µg/m³</span>
                        </div>
                    </div>

                    {/* Scale Section */}
                    <div className="mb-6 md:mb-8 relative z-20">
                        {/* Top Labels */}
                        <div className="flex justify-between text-[8px] md:text-[10px] font-bold opacity-90 mb-1 px-1">
                            <span className="w-[16%] text-center">Good</span>
                            <span className="w-[16%] text-center">Moderate</span>
                            <span className="w-[16%] text-center">Poor</span>
                            <span className="w-[16%] text-center">Unhealthy</span>
                            <span className="w-[16%] text-center">Severe</span>
                            <span className="w-[16%] text-center">Hazardous</span>
                        </div>

                        {/* The Track */}
                        <div className="h-1.5 w-full rounded-full flex overflow-visible relative shadow-sm mx-auto" style={{ width: '99%' }}>
                            <div className="flex-1 bg-[#55a84f] rounded-l-full" /> {/* Good */}
                            <div className="flex-1 bg-[#a3c853]" /> {/* Moderate */}
                            <div className="flex-1 bg-[#fff833]" /> {/* Poor */}
                            <div className="flex-1 bg-[#f29c33]" /> {/* Unhealthy */}
                            <div className="flex-1 bg-[#e93f33]" /> {/* Severe */}
                            <div className="flex-1 bg-[#af2d24] rounded-r-full" /> {/* Hazardous */}

                            {/* The Indicator */}
                            <div
                                className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-[3px] rounded-full shadow z-30 ring-1 ring-black/10 transition-all duration-700 ease-out"
                                style={{
                                    borderColor: theme.solidColor,
                                    left: indicatorLeft
                                }}
                            />
                        </div>

                        {/* Bottom Values */}
                        <div className="flex justify-between text-[8px] md:text-[10px] opacity-70 mt-1 px-0 font-mono font-medium">
                            <span className="w-[16%] text-center relative left-[-8px]">0</span>
                            <span className="w-[16%] text-center">50</span>
                            <span className="w-[16%] text-center">100</span>
                            <span className="w-[16%] text-center">200</span>
                            <span className="w-[16%] text-center">300</span>
                            <span className="w-[16%] text-center">400</span>
                            <span className="w-[16%] text-center relative left-[8px]">500+</span>
                        </div>
                    </div>

                    {/* Weather Card */}
                    <div className="relative bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-lg overflow-hidden">
                        {/* Top Row */}
                        <div className="flex justify-between items-center p-3 md:p-4 pb-2 md:pb-3 border-b border-white/10">
                            <div className="flex items-center gap-3 md:gap-4">
                                {/* Weather Icon */}
                                <Cloud className="w-8 h-8 md:w-10 md:h-10 text-white drop-shadow-sm filter drop-shadow opacity-90" fill="currentColor" />

                                {/* Temp & Condition */}
                                <div className="flex items-center gap-2 md:gap-3">
                                    <span className="text-2xl md:text-3xl font-bold text-white">{city.weather.temp} <span className="text-lg md:text-xl align-top">°C</span></span>
                                    <span className="text-xs md:text-sm font-medium text-white/90 mt-1">Fog</span>
                                </div>
                            </div>

                            {/* Arrow Button */}
                            <div className="bg-white/90 p-1 md:p-1.5 rounded-full shadow hover:bg-white transition-colors cursor-pointer">
                                <ArrowUpRight size={16} className="text-black" />
                            </div>
                        </div>

                        {/* Bottom Row */}
                        <div className="grid grid-cols-3 py-2 md:py-3 text-white">
                            <div className="flex flex-row items-center justify-center gap-1 md:gap-2">
                                <Droplets size={14} className="md:w-4 md:h-4 opacity-90" strokeWidth={2.5} />
                                <span className="text-xs md:text-[15px] font-bold">{city.weather.humidity} %</span>
                            </div>

                            <div className="flex flex-row items-center justify-center gap-1 md:gap-2 border-l border-r border-white/20">
                                <Wind size={14} className="md:w-4 md:h-4 opacity-90" strokeWidth={2.5} />
                                <span className="text-xs md:text-[15px] font-bold">{city.weather.wind} km/h</span>
                            </div>

                            <div className="flex flex-row items-center justify-center gap-1 md:gap-2">
                                <Sun size={14} className="md:w-4 md:h-4 opacity-90" strokeWidth={2.5} />
                                <span className="text-xs md:text-[15px] font-bold">2</span>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-4 text-center">
                        <p className="text-white/70 text-[10px] md:text-[11px] font-medium italic tracking-wide">
                            Last Updated: {new Date(city.lastUpdated).toLocaleString('en-IN', {
                                day: '2-digit', month: 'short', year: 'numeric',
                                hour: '2-digit', minute: '2-digit', hour12: true
                            })} (Local Time)
                        </p>
                        <p className="text-white/50 text-[9px] md:text-[10px] mt-0.5">
                            Nearest Monitor: 0.87 km
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
}

// Exact Theme Match Attempt
function getAQITheme(aqi) {
    // Good (0-50)
    if (aqi <= 50) return {
        gradient: 'linear-gradient(135deg, #1a4d2e 0%, #2f6a15 100%)',
        solidColor: '#55a84f',
        textColor: '#66bb6a',
        badgeBg: '#1b3e20',
        badgeText: '#fff'
    };
    // Moderate (51-100)
    if (aqi <= 100) return {
        gradient: 'linear-gradient(135deg, #4f5b24 0%, #82961e 100%)',
        solidColor: '#a3c853',
        textColor: '#dce775',
        badgeBg: '#33691e',
        badgeText: '#fff'
    };
    // Poor (101-200)
    if (aqi <= 200) return {
        gradient: 'linear-gradient(135deg, #9e600b 0%, #d48030 100%)', // Brownish Orange
        solidColor: '#f29c33',
        textColor: '#ffcc80',
        badgeBg: '#5d3005', // Dark brown button for contrast
        badgeText: '#fff'
    };
    // Unhealthy (201-300)
    if (aqi <= 300) return {
        gradient: 'linear-gradient(135deg, #8a1c3e 0%, #c2185b 100%)',
        solidColor: '#e93f33',
        textColor: '#f48fb1',
        badgeBg: '#880e4f',
        badgeText: '#fff'
    };
    // Severe (301-400) - Reference is Purple
    if (aqi <= 400) return {
        gradient: 'linear-gradient(180deg, #381236 0%, #682a63 100%)', // Deep Purple Gradient
        solidColor: '#9c27b0', // Purple dot
        textColor: '#d45cdb', // Lighter Purple Text (The Big Number)
        badgeBg: '#4a184d', // Dark Purple Badge Background
        badgeText: '#ce93d8' // Light purple badge text
    };
    // Hazardous (401+)
    return {
        gradient: 'linear-gradient(135deg, #4a0f0f 0%, #7f1d1d 100%)',
        solidColor: '#af2d24',
        textColor: '#ef5350',
        badgeBg: '#b71c1c',
        badgeText: '#fff'
    };
}

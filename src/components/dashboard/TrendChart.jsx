import { useState, useEffect, useRef } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from 'recharts';
import { Loader2 } from 'lucide-react';

// Helper to interpolate between two hex colors
const interpolateColor = (color1, color2, factor) => {
    const result = color1.slice(1).match(/.{2}/g).map((hex, i) => {
        const v1 = parseInt(hex, 16);
        const v2 = parseInt(color2.slice(1).match(/.{2}/g)[i], 16);
        return Math.round(v1 + factor * (v2 - v1));
    });
    return `rgb(${result.join(',')})`;
};

// Gradient AQI Color Generator (Smooth transition)
const getAQIColor = (aqi) => {
    // Stops matching the AQI Gauge Theme & Track
    // 0: Good (Green)
    // 50: Moderate Start (Yellow-Green)
    // 100: Poor Start (Yellow)
    // 200: Unhealthy Start (Orange)
    // 300: Severe Start (Red)
    // 400: Hazardous Start (Purple)
    // 500+: Maximum (Maroon)

    if (aqi <= 50) return interpolateColor('#55a84f', '#a3c853', aqi / 50);
    if (aqi <= 100) return interpolateColor('#a3c853', '#fff833', (aqi - 50) / 50);
    if (aqi <= 200) return interpolateColor('#fff833', '#f29c33', (aqi - 100) / 100);
    if (aqi <= 300) return interpolateColor('#f29c33', '#e93f33', (aqi - 200) / 100);
    if (aqi <= 400) return interpolateColor('#e93f33', '#9c27b0', (aqi - 300) / 100);
    if (aqi <= 500) return interpolateColor('#9c27b0', '#af2d24', (aqi - 400) / 100);
    return '#af2d24';
};

export function TrendChart({ data, history = [], isLoading }) {
    const [range, setRange] = useState('24h');

    // Responsive handling
    const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 1024 : false);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 1024);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Handle Data Processing based on Range
    let refinedData = [];

    // If loading, refinedData stays empty, we show loader
    if (!isLoading) {
        if (range === '24h') {
            // Use 'history' last 24 items if available
            refinedData = history.length > 0 ? history.slice(-24) : [];

            // Update time labels to show hour only (e.g., "7 PM", "8 PM")
            refinedData = refinedData.map(item => ({
                ...item,
                time: item.time || new Date(item.timestamp).toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    hour12: true
                })
            }));
        } else {
            // 7 Days or 30 Days (Requires History)
            const days = range === '7d' ? 7 : 30;
            const totalHours = days * 24;

            // Slice history
            const slice = history.length > 0 ? history.slice(-totalHours) : [];

            if (range === '30d' || range === '7d') {
                // Aggregate by Day (Mean) for better Bar Chart visibility
                const daily = {};
                slice.forEach(item => {
                    const date = item.fullDate;
                    if (!daily[date]) { daily[date] = { count: 0, aqi: 0, pm25: 0, pm10: 0, fullDate: date }; }
                    daily[date].count++;
                    daily[date].aqi += item.aqi || 0;
                    daily[date].pm25 += item.pm25 || 0;
                    daily[date].pm10 += item.pm10 || 0;
                });
                refinedData = Object.values(daily).map(d => ({
                    time: d.fullDate,
                    aqi: Math.round(d.aqi / d.count),
                    pm25: Math.round(d.pm25 / d.count),
                    pm10: Math.round(d.pm10 / d.count)
                }));
            }
        }
    }

    // Determine if we need scrolling
    // Desktop: Show everything (up to 24-30 bars fit easily)
    // Mobile: Show only 7 bars, scroll for rest
    const MAX_VISIBLE_BARS = 7;
    const needsScroll = isMobile && refinedData.length > MAX_VISIBLE_BARS;

    // Calculate dimensions
    // Mobile: Fit 7 bars in ~300px visible space -> ~40px per item
    const barWidth = needsScroll ? 28 : undefined; // Fixed on mobile, auto on desktop
    const barGap = needsScroll ? 12 : 5; // Tighter gap on desktop
    const barSpacing = 40; // 28 + 12 = 40px per bar group
    const yAxisWidth = 50;

    // Measure container size
    const containerRef = useRef(null);
    const [chartDims, setChartDims] = useState({ width: 0, height: 300 });

    useEffect(() => {
        if (!containerRef.current) return;

        const resizeObserver = new ResizeObserver((entries) => {
            for (const entry of entries) {
                if (entry.contentRect.height > 0) {
                    setChartDims({
                        width: entry.contentRect.width,
                        height: entry.contentRect.height
                    });
                }
            }
        });

        resizeObserver.observe(containerRef.current);
        return () => resizeObserver.disconnect();
    }, []); // Run once on mount

    const chartHeight = chartDims.height;
    // For chart width: if scrolling, calculate specifically. If not, use container width.
    // However, if container width is 0 (initial), fallback to something?
    // We already have needsScroll logic.

    // Total width needed for all bars if scrolling
    const scrollWidth = Math.max(refinedData.length * barSpacing, 0);
    const finalChartWidth = needsScroll ? scrollWidth : (chartDims.width || '100%');

    // Calculate max AQI for dynamic Y-axis
    const maxAQI = refinedData.length > 0 ? Math.max(...refinedData.map(d => d.aqi)) : 100;
    const yAxisMax = Math.max(100, Math.ceil((maxAQI + 10) / 50) * 50);
    const yTicks = Array.from({ length: 6 }, (_, i) => Math.round((yAxisMax / 5) * i));

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-slate-900/95 backdrop-blur-md p-4 rounded-xl border border-white/10 shadow-xl min-w-[180px]">
                    <p className="text-gray-400 text-xs mb-2 font-medium uppercase tracking-wider">{data.fullDate} • {data.time}</p>

                    <div className="flex items-center justify-between mb-3 pb-3 border-b border-white/10">
                        <span className="text-white font-bold text-lg">AQI</span>
                        <div className="flex items-center gap-2">
                            <span
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: getAQIColor(data.aqi) }}
                            />
                            <span className="text-xl font-bold" style={{ color: getAQIColor(data.aqi) }}>
                                {data.aqi}
                            </span>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-300">PM2.5</span>
                            <span className="text-white font-mono">{data.pm25}<span className="text-gray-500 text-xs ml-1">µg/m³</span></span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-300">PM10</span>
                            <span className="text-white font-mono">{data.pm10}<span className="text-gray-500 text-xs ml-1">µg/m³</span></span>
                        </div>
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="w-full h-[450px] bg-white/5 backdrop-blur-xl border border-white/10 rounded-[32px] p-2 flex flex-col relative overflow-hidden group">
            <style>{`
                .recharts-wrapper:focus,
                .recharts-wrapper:focus-visible,
                .recharts-surface:focus,
                .recharts-surface:focus-visible,
                .hide-focus-ring:focus,
                .hide-focus-ring:focus-visible {
                    outline: none !important;
                    box-shadow: none !important;
                    -webkit-tap-highlight-color: transparent;
                }
            `}</style>
            {/* Decorative blob */}
            <div className="absolute -top-20 -right-20 w-60 h-60 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none group-hover:bg-blue-500/20 transition-colors duration-500" />

            <div className="flex flex-col sm:flex-row justify-between p-4 items-start sm:items-center mb-8 gap-4 relative z-20">
                <div>
                    <h3 className="text-xl font-bold text-white tracking-wide">
                        {range === '24h' ? '24-Hour Trend' : range === '7d' ? '7-Day Trend' : '30-Day Trend'}
                    </h3>
                    <p className="text-sm text-blue-200/60 mt-1">
                        {range === '24h' ? 'Hourly fluctuation' : 'Daily Average'}
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    {/* Range Tabs */}
                    <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
                        {['24h', '7d', '30d'].map((r) => (
                            <button
                                key={r}
                                onClick={() => setRange(r)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${range === r ? 'bg-white/20 text-white' : 'text-white/40 hover:text-white'}`}
                            >
                                {r.toUpperCase()}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Chart container with fixed Y-axis */}
            <div className="flex-1 w-full min-h-0 relative z-10" ref={containerRef}>
                {isLoading ? (
                    <div className="h-full w-full flex items-center justify-center flex-col gap-3">
                        <Loader2 className="animate-spin text-neon-cyan" size={40} />
                        <span className="text-white/50 text-sm font-medium">Loading Data...</span>
                    </div>
                ) : (
                    <div className="h-full w-full flex">
                        {/* Fixed Y-axis container */}
                        <div style={{ width: yAxisWidth, flexShrink: 0 }}>
                            <svg width={yAxisWidth} height={chartHeight}>
                                {/* Y-axis labels */}
                                {yTicks.map((value) => {
                                    // Adjust for layout:
                                    // Top Margin: 10px
                                    // Bottom Margin: 20px
                                    // X-Axis Height (reserved by Recharts): ~30px
                                    // Total Bottom offset of chart area = 20 + 30 = 50px
                                    // Available height for bars = chartHeight - 10 (top) - 50 (bottom) = chartHeight - 60

                                    const effectiveBottom = chartHeight - 50;
                                    const effectiveHeight = chartHeight - 60;

                                    const y = effectiveBottom - (value / yAxisMax) * effectiveHeight;
                                    return (
                                        <text
                                            key={value}
                                            x={yAxisWidth - 10}
                                            y={y}
                                            textAnchor="end"
                                            fill="#94a3b8"
                                            fontSize="11"
                                            dominantBaseline="middle"
                                        >
                                            {value}
                                        </text>
                                    );
                                })}
                            </svg>
                        </div>

                        {/* Scrollable chart area */}
                        <div
                            className="flex-1 overflow-x-auto overflow-y-hidden hide-focus-ring outline-none"
                            tabIndex={-1}
                            style={{
                                scrollbarWidth: 'thin',
                                scrollbarColor: 'rgba(255,255,255,0.2) rgba(255,255,255,0.05)'
                            }}
                        >
                            <div style={{ width: finalChartWidth, minWidth: '100%', height: '100%' }}>
                                <BarChart
                                    className="outline-none focus:outline-none"
                                    width={typeof finalChartWidth === 'number' ? finalChartWidth : undefined}
                                    height={chartHeight}
                                    data={refinedData}
                                    margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
                                    barGap={barGap}
                                >
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                    <XAxis
                                        dataKey="time"
                                        stroke="#94a3b8"
                                        fontSize={11}
                                        tickLine={false}
                                        axisLine={false}
                                        tickMargin={15}
                                    />
                                    <YAxis hide domain={[0, yAxisMax]} />
                                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />

                                    {/* AQI Series with dynamic colors per bar */}
                                    <Bar
                                        dataKey="aqi"
                                        name="AQI"
                                        radius={[4, 4, 0, 0]}
                                        animationDuration={1000}
                                        barSize={barWidth}
                                    >
                                        {refinedData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={getAQIColor(entry.aqi)} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

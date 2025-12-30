import { ArrowUp, ArrowDown, Minus, MapPin } from 'lucide-react';
import { getAQIColor } from '../../data/mockData';

export function CityComparison({ cities, isLoading }) {
    if (isLoading) {
        return (
            <div className="w-full mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map(i => (
                    <div key={i} className="h-40 bg-white/5 animate-pulse rounded-[24px]" />
                ))}
            </div>
        );
    }

    return (
        <div className="w-full mt-12">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h3 className="text-xl font-bold text-white tracking-wide">Major Indian Cities</h3>
                    <p className="text-sm text-blue-200/60 mt-1">Live data from across the country</p>
                </div>
                <button className="text-blue-400 text-sm font-medium hover:text-blue-300 transition-colors bg-blue-500/10 px-4 py-2 rounded-lg hover:bg-blue-500/20">
                    View All
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cities.map((city) => {
                    const color = getAQIColor(city.aqi);
                    // Trend calc if available
                    const hasTrend = city.trend && city.trend.length > 1;
                    const last = hasTrend ? city.trend[city.trend.length - 1] : city.aqi;
                    const prev = hasTrend ? (city.trend[city.trend.length - 2] || last) : city.aqi;
                    const diff = last - prev;

                    return (
                        <div
                            key={`${city.name}-${city.lat}-${city.lon}`}
                            className="group relative overflow-hidden bg-white/5 backdrop-blur-md border border-white/10 rounded-[24px] p-6 transition-all duration-300 hover:translate-y-[-4px] hover:shadow-lg hover:shadow-black/20"
                            style={{ '--hover-color': color }}
                        >
                            {/* Hover Border Gradient */}
                            <div className="absolute inset-0 border-2 border-transparent rounded-[24px] pointer-events-none transition-colors duration-300 group-hover:border-[var(--hover-color)] opacity-50" />

                            <div className="flex justify-between items-start mb-6 relative z-10">
                                <div>
                                    <div className="flex items-center gap-1.5 mb-2 text-blue-200/60 text-xs font-bold uppercase tracking-wider">
                                        <MapPin size={12} />
                                        <span>Live Station</span>
                                    </div>
                                    <span className="block text-lg font-bold text-white tracking-tight">{city.name}</span>
                                </div>
                                <div
                                    className="px-3 py-1.5 rounded-xl font-bold text-sm shadow-sm border border-black/10"
                                    style={{ backgroundColor: color, color: '#000' }}
                                >
                                    {city.aqi}
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-white/5 relative z-10">
                                <span className="text-sm font-medium transition-colors group-hover:brightness-125" style={{ color: color }}>
                                    {city.status}
                                </span>

                                <div className="flex items-center gap-2 text-xs font-medium">
                                    {hasTrend ? (
                                        diff > 0 ? (
                                            <span className="text-red-400 flex items-center bg-red-400/10 px-2 py-1 rounded-md"><ArrowUp size={12} className="mr-1" /> {diff}</span>
                                        ) : diff < 0 ? (
                                            <span className="text-emerald-400 flex items-center bg-emerald-400/10 px-2 py-1 rounded-md"><ArrowDown size={12} className="mr-1" /> {Math.abs(diff)}</span>
                                        ) : (
                                            <span className="text-slate-400 flex items-center bg-slate-400/10 px-2 py-1 rounded-md"><Minus size={12} /></span>
                                        )
                                    ) : (
                                        <span className="text-slate-500 italic">Real-time</span>
                                    )}
                                    {hasTrend && <span className="text-slate-500">vs yesterday</span>}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

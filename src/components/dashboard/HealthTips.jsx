import { Activity, Wind, AlertTriangle, Heart } from 'lucide-react';
import { getAQIColor } from '../../data/mockData';

export function HealthTips({ city }) {
    const color = getAQIColor(city.aqi);

    // Logic based on AQI to return tips
    const getTips = (aqi) => {
        if (aqi > 300) return [
            { icon: AlertTriangle, text: 'Avoid all outdoor exertion.', severity: 'critical' },
            { icon: Wind, text: 'Keep windows closed and use an air purifier.', severity: 'critical' },
            { icon: Heart, text: 'People with heart or lung disease should stay indoors.', severity: 'critical' }
        ];
        if (aqi > 200) return [
            { icon: Activity, text: 'Sensitive groups should avoid outdoor activity.', severity: 'high' },
            { icon: Wind, text: 'Wear a mask if you must go outside.', severity: 'high' }
        ];
        if (aqi > 100) return [
            { icon: Activity, text: 'Reduce prolonged outdoor exertion.', severity: 'moderate' },
            { icon: Wind, text: 'Sensitive groups should wear a mask.', severity: 'moderate' }
        ];
        return [
            { icon: Activity, text: 'Air quality is good. Enjoy outdoor activities!', severity: 'low' },
            { icon: Wind, text: 'Ventilate your home.', severity: 'low' }
        ];
    };

    const tips = getTips(city.aqi);

    return (
        <div className="w-full mt-12 relative overflow-hidden">
            <div className="mb-8">
                <h3 className="text-xl font-bold text-white tracking-wide">Health Recommendations</h3>
                <p className="text-sm text-blue-200/60 mt-1">Protect yourself based on current air quality</p>
            </div>

            <div
                className="relative bg-white/5 backdrop-blur-md border border-white/10 rounded-[32px] p-8 overflow-hidden"
                style={{
                    boxShadow: `0 0 40px ${color}15`
                }}
            >
                {/* Decorative gradient blob */}
                <div
                    className="absolute -top-20 -right-20 w-80 h-80 rounded-full blur-[100px] opacity-20 pointer-events-none"
                    style={{ backgroundColor: color }}
                />

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 relative z-10">
                    {tips.map((tip, i) => (
                        <div
                            key={i}
                            className="group flex flex-col gap-4 bg-white/5 backdrop-blur-sm p-5 rounded-2xl border border-white/10 transition-all duration-300 hover:bg-white/10 hover:translate-y-[-2px] hover:shadow-lg"
                        >
                            <div
                                className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                                style={{
                                    backgroundColor: `${color}20`,
                                    boxShadow: `0 4px 12px ${color}30`
                                }}
                            >
                                <tip.icon size={22} style={{ color }} strokeWidth={2.5} />
                            </div>
                            <p className="m-0 text-sm text-slate-200 leading-relaxed font-medium">
                                {tip.text}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

import { Info } from 'lucide-react';

export function AQIScale() {
    const aqiCategories = [
        { label: 'Good', range: '0-50', color: '#59B61F', description: 'Air quality is satisfactory' },
        { label: 'Moderate', range: '51-100', color: '#EEC732', description: 'Acceptable for most people' },
        { label: 'Poor', range: '101-200', color: '#EA8C34', description: 'May cause breathing discomfort' },
        { label: 'Unhealthy', range: '201-300', color: '#E95478', description: 'May cause respiratory illness' },
        { label: 'Severe', range: '301-400', color: '#B33FBA', description: 'Health alert: everyone may experience effects' },
        { label: 'Hazardous', range: '401-500', color: '#C92033', description: 'Health warnings of emergency conditions' },
    ];

    return (
        <div className="w-full mt-12">
            <div className="mb-8">
                <h3 className="text-xl font-bold text-white tracking-wide">AQI Scale</h3>
                <p className="text-sm text-blue-200/60 mt-1">Understanding air quality index levels</p>
            </div>

            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-[32px] p-8 relative overflow-hidden">
                {/* Decorative blob */}
                <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-purple-500/10 rounded-full blur-[80px] pointer-events-none" />

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 relative z-10">
                    {aqiCategories.map((category, index) => (
                        <div
                            key={index}
                            className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5 transition-all duration-300 hover:bg-white/10 hover:translate-y-[-2px] overflow-hidden"
                        >
                            {/* Color indicator bar */}
                            <div
                                className="absolute top-0 left-0 w-full h-1 rounded-t-2xl"
                                style={{ backgroundColor: category.color }}
                            />

                            <div className="flex items-start justify-between mb-3 mt-2">
                                <div>
                                    <h4 className="text-white font-bold text-base mb-1">{category.label}</h4>
                                    <span
                                        className="text-xs font-bold px-2 py-1 rounded-md"
                                        style={{
                                            backgroundColor: `${category.color}20`,
                                            color: category.color
                                        }}
                                    >
                                        {category.range}
                                    </span>
                                </div>

                                {/* Color circle */}
                                <div
                                    className="w-8 h-8 rounded-full border-2 border-white/20 transition-transform duration-300 group-hover:scale-110"
                                    style={{ backgroundColor: category.color }}
                                />
                            </div>

                            <p className="text-xs text-slate-300 leading-relaxed mt-3">
                                {category.description}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Info footer */}
                <div className="mt-8 flex items-start gap-3 bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 relative z-10">
                    <Info size={18} className="text-blue-400 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-blue-200/80 leading-relaxed">
                        The Air Quality Index (AQI) is calculated based on pollutants like PM2.5, PM10, NO2, SO2, CO, and O3.
                        Higher values indicate greater health concerns.
                    </p>
                </div>
            </div>
        </div>
    );
}
